import {
  AreaComp,
  BodyComp,
  DoubleJumpComp,
  GameObj,
  KaboomCtx,
  PosComp,
  ScaleComp,
  SpriteComp,
} from "kaboom";
import { scale } from "./constants";

type PlayerGameObj = GameObj<
  SpriteComp &
    AreaComp &
    BodyComp &
    PosComp &
    ScaleComp &
    DoubleJumpComp & { speed: number; direction: string; isInhaling: boolean }
>;

export function makePlayer(k: KaboomCtx, posX: number, posY: number) {
  const player = k.make([
    k.sprite("assets", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(4, 5.9), 8, 10) }),
    k.body(),
    k.pos(posX * scale, posY * scale),
    k.scale(scale),
    k.doubleJump(10),
    {
      speed: 300,
      direction: "right",
      isInhaling: false,
    },
    "player",
  ]);

  const inhaleZone = player.add([
    k.area({ shape: new k.Rect(k.vec2(0), 16, 8) }),
    k.pos(14, 5),
    "inhaleZone",
  ]);

  inhaleZone.onUpdate(() => {
    if (player.direction === "left") {
      inhaleZone.pos = k.vec2(-14, 5);
      return;
    }
    inhaleZone.pos = k.vec2(14, 5);
  });

  return player;
}

export function setControls(k: KaboomCtx, player: PlayerGameObj) {
  k.onKeyDown((key) => {
    switch (key) {
      case "left":
        player.direction = "left";
        player.flipX = true;
        player.move(-player.speed, 0);
        break;
      case "right":
        player.direction = "right";
        player.flipX = false;
        player.move(player.speed, 0);
        break;
      case "z":
        player.isInhaling = true;
        player.play("kirbInhaling");
        break;
      default:
    }
  });
  k.onKeyPress((key) => {
    switch (key) {
      case "x":
        player.doubleJump();
        break;
      default:
    }
  });
  k.onKeyRelease((key) => {
    switch (key) {
      case "z":
        player.isInhaling = false;
        player.play("kirbIdle");
        break;
      default:
    }
  });
}

export function makeInhalable(k: KaboomCtx, enemy: GameObj) {
  enemy.onCollide("inhaleZone", () => {
    enemy.isInhalable = true;
  });

  enemy.onCollideEnd("inhaleZone", () => {
    enemy.isInhalable = false;
  });

  const playerRef = k.get("player")[0];
  enemy.onUpdate(() => {
    if (playerRef.isInhaling && enemy.isInhalable) {
      if (playerRef.direction === "right") {
        enemy.moveTo(enemy.pos.sub(playerRef.pos), 200);
        return;
      }
      enemy.moveTo(enemy.pos.add(playerRef.pos), 200);
    }
  });

  enemy.onCollide("player", () => {
    if (!playerRef.isInhaling) return;
    playerRef.isInhaling = false;
    k.destroy(enemy);
  });
}

export function makeFlameEnemy(k: KaboomCtx, posX: number, posY: number) {
  const flame = k.add([
    k.sprite("assets", { anim: "flame" }),
    k.scale(scale),
    k.pos(posX * scale, posY * scale),
    k.area({ shape: new k.Rect(k.vec2(4, 6), 8, 10) }),
    k.body(),
    "flame",
  ]);

  makeInhalable(k, flame);

  return flame;
}

export function makeGuyEnemy(k: KaboomCtx, posX: number, posY: number) {
  const guy = k.add([
    k.sprite("assets", { anim: "guyWalk" }),
    k.scale(scale),
    k.pos(posX * scale, posY * scale),
    k.area({ shape: new k.Rect(k.vec2(2, 3.9), 12, 12) }),
    k.body(),
    { isInhalable: false },
    "guy",
  ]);

  makeInhalable(k, guy);

  return guy;
}

export function makeBirdEnemy(k: KaboomCtx, posX: number, posY: number) {
  const bird = k.add([
    k.sprite("assets", { anim: "bird" }),
    k.scale(scale),
    k.pos(posX * scale, posY * scale),
    k.area({ shape: new k.Rect(k.vec2(4, 6), 8, 10) }),
    k.body({ isStatic: true }),
    "bird",
  ]);

  makeInhalable(k, bird);

  return bird;
}
