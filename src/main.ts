import { k } from "./kaboomCtx";
import { makeMap } from "./utils";
import {
  makeBirdEnemy,
  makeFlameEnemy,
  makeGuyEnemy,
  makePlayer,
  setControls,
} from "./entities";

k.loadSprite("assets", "./kirby-like.png", {
  sliceX: 9,
  sliceY: 10,
  anims: {
    kirbIdle: 0,
    kirbInhaling: 1,
    kirbFull: 2,
    kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
    shootingStar: 9,
    flame: { from: 36, to: 37, speed: 4, loop: true },
    guyIdle: 18,
    guyWalk: { from: 18, to: 19, speed: 4, loop: true },
    bird: { from: 27, to: 28, speed: 4, loop: true },
  },
});
k.loadSprite("level-1", "./level-1.png");

async function gameSetup() {
  k.loadSprite("assets", "./kirby-like.png", {
    sliceX: 9,
    sliceY: 10,
    anims: {
      kirbIdle: 0,
      kirbInhaling: 1,
      kirbFull: 2,
      kirbInhaleEffect: { from: 3, to: 8, speed: 15, loop: true },
      shootingStar: 9,
      flame: { from: 36, to: 37, speed: 4, loop: true },
      guyIdle: 18,
      guyWalk: { from: 18, to: 19, speed: 4, loop: true },
      bird: { from: 27, to: 28, speed: 4, loop: true },
    },
  });
  k.loadSprite("level-1", "./level-1.png");

  k.add([k.rect(k.width(), k.height()), k.color(0, 0, 0), k.fixed()]);

  const { map, spawnPoints } = await makeMap(k, "level-1");

  k.scene("level-1", async () => {
    k.setGravity(2100);
    k.add([
      k.rect(k.width(), k.height()),
      k.color(k.Color.fromHex("#f7d7db")),
      k.fixed(),
    ]);

    k.add(map);

    const kirb = makePlayer(
      k,
      spawnPoints.player[0].x,
      spawnPoints.player[0].y
    );

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
      makeFlameEnemy(k, flame.x, flame.y);
    }

    for (const guy of spawnPoints.guy) {
      makeGuyEnemy(k, guy.x, guy.y);
    }

    for (const bird of spawnPoints.bird) {
      makeBirdEnemy(k, bird.x, bird.y);
    }
  });

  k.go("level-1");
}

gameSetup();
