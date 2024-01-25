import kaboom, { GameObj, KaboomCtx, Vec2 } from "kaboom";

const scale = 4;
const k = kaboom({
  width: 256 * scale,
  height: 144 * scale,
  letterbox: true,
  global: false,
});

k.loadSprite("assets", "./kirby-like.png", {
  sliceX: 9,
  sliceY: 10,
  anims: {
    kirbIdle: 0,
    kirbInhaling: 1,
    kirbSwallowed: 2,
    flame: { from: 36, to: 37, speed: 4, loop: true },
    guyIdle: 18,
    guyWalk: { from: 18, to: 19, speed: 4, loop: true },
    bird: { from: 27, to: 28, speed: 4, loop: true },
  },
});
k.loadSprite("level-1", "./level-1.png");

function setControls(kirb: GameObj) {
  k.onKeyDown((key) => {
    switch (key) {
      case "left":
        kirb.flipX = true;
        kirb.move(-kirb.speed, 0);
        break;
      case "right":
        kirb.flipX = false;
        kirb.move(kirb.speed, 0);
        break;
      case "z":
        kirb.play("kirbInhaling");
        break;
      default:
    }
  });
  k.onKeyPress((key) => {
    switch (key) {
      case "space":
        kirb.doubleJump();
        break;
      default:
    }
  });
  k.onKeyRelease((key) => {
    switch (key) {
      case "z":
        kirb.play("kirbIdle");
        break;
      default:
    }
  });
}

async function makeMap(name: string) {
  const mapData = await (await fetch(`./${name}.json`)).json();

  const map = k.make([k.sprite(name), k.scale(4), k.pos(0)]);

  const spawnPoints: { [key: string]: { x: number; y: number }[] } = {};

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          collider.name !== "exit" ? k.body({ isStatic: true }) : null,
          k.pos(collider.x, collider.y),
          collider.name !== "exit" ? "platform" : "exit",
        ]);
      }
      continue;
    }
    if (layer.name === "spawnpoints") {
      for (const spawnPoint of layer.objects) {
        if (spawnPoints[spawnPoint.name]) {
          spawnPoints[spawnPoint.name].push({
            x: spawnPoint.x,
            y: spawnPoint.y,
          });
          continue;
        }
        spawnPoints[spawnPoint.name] = [{ x: spawnPoint.x, y: spawnPoint.y }];
      }
    }
  }

  return { map, spawnPoints };
}

k.scene("level-1", async () => {
  k.setGravity(2100);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#f7d7db")),
    k.fixed(),
  ]);

  const { map, spawnPoints } = await makeMap("level-1");
  k.add(map);

  const kirb: GameObj = k.make([
    k.sprite("assets", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
    k.body(),
    k.pos(spawnPoints.player[0].x * scale, spawnPoints.player[0].y * scale),
    k.scale(4),
    k.doubleJump(10),
    {
      speed: 300,
    },
  ]);

  setControls(kirb);
  k.add(kirb);
  k.onUpdate(() => {
    if (kirb.pos.y < 600) {
      k.camPos(kirb.pos.x, 500);
      return;
    }
    k.camPos(kirb.pos.x, 900);
  });

  for (const flame of spawnPoints.flame) {
    k.add([
      k.sprite("assets", { anim: "flame" }),
      k.scale(4),
      k.pos(flame.x * scale, flame.y * scale),
      k.area(),
      k.body(),
      "flame",
    ]);
  }

  for (const guy of spawnPoints.guy) {
    k.add([
      k.sprite("assets", { anim: "guyWalk" }),
      k.scale(4),
      k.pos(guy.x * scale, guy.y * scale),
      k.area(),
      k.body(),
    ]);
  }

  for (const bird of spawnPoints.bird) {
    k.add([
      k.sprite("assets", { anim: "bird" }),
      k.scale(4),
      k.pos(bird.x * scale, bird.y * scale),
      k.area(),
      k.body({ isStatic: true }),
    ]);
  }
});

k.go("level-1");
