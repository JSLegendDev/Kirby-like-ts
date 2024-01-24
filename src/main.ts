import kaboom, { GameObj } from "kaboom";

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

  for (const layer of mapData.layers) {
    if (layer.name === "colliders") {
      for (const collider of layer.objects) {
        map.add([
          k.area({
            shape: new k.Rect(k.vec2(0), collider.width, collider.height),
            collisionIgnore: ["platform", "exit"],
          }),
          k.body({ isStatic: true }),
          k.pos(collider.x, collider.y),
          collider.name !== "exit" ? "platform" : "exit",
        ]);
      }

      return map;
    }
  }
}

k.scene("level-1", async () => {
  k.setGravity(2100);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#f7d7db")),
    k.fixed(),
  ]);

  const map = await makeMap("level-1");
  k.add(map);

  const kirb: GameObj = k.make([
    k.sprite("assets", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
    k.body(),
    k.pos(k.center()),
    k.scale(4),
    k.doubleJump(10),
    {
      speed: 300,
    },
  ]);

  setControls(kirb);
  k.add(kirb);
  k.onUpdate(() => k.camPos(kirb.pos.x, kirb.pos.y - 100));
});

k.go("level-1");
