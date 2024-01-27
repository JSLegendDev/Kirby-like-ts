import { GameObj } from "kaboom";
import { k } from "./kaboomCtx";
import { scale } from "./constants";
import { makeMap } from "./utils";
import { makePlayer, setControls } from "./entities";

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

k.scene("level-1", async () => {
  k.setGravity(2100);
  k.add([
    k.rect(k.width(), k.height()),
    k.color(k.Color.fromHex("#f7d7db")),
    k.fixed(),
  ]);

  const { map, spawnPoints } = await makeMap(k, "level-1");
  k.add(map);

  const kirb = makePlayer(k, spawnPoints.player[0].x, spawnPoints.player[0].y);

  setControls(k, kirb);
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
      k.scale(scale),
      k.pos(flame.x * scale, flame.y * scale),
      k.area({ shape: new k.Rect(k.vec2(4, 6), 8, 10) }),
      k.body(),
      "flame",
    ]);
  }

  for (const guy of spawnPoints.guy) {
    k.add([
      k.sprite("assets", { anim: "guyWalk" }),
      k.scale(scale),
      k.pos(guy.x * scale, guy.y * scale),
      k.area({ shape: new k.Rect(k.vec2(2, 4), 12, 12) }),
      k.body(),
      "guy",
    ]);
  }

  for (const bird of spawnPoints.bird) {
    k.add([
      k.sprite("assets", { anim: "bird" }),
      k.scale(scale),
      k.pos(bird.x * scale, bird.y * scale),
      k.area({ shape: new k.Rect(k.vec2(4, 6), 8, 10) }),
      k.body({ isStatic: true }),
      "bird",
    ]);
  }
});

k.go("level-1");
