import kaboom, { GameObj, GameObjRaw, SpriteComp } from "kaboom";

const scale = 4;
const k = kaboom({
  width: 160 * scale,
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

k.scene("level-1", () => {
  k.setGravity(2200);
  k.add([k.rect(k.width(), k.height()), k.color(k.Color.fromHex("#f7d7db"))]);

  const kirb: GameObj = k.make([
    k.sprite("assets", { anim: "kirbIdle" }),
    k.area({ shape: new k.Rect(k.vec2(0), 16, 16) }),
    k.body(),
    k.pos(k.center()),
    k.scale(4),
    k.doubleJump(10),
    {
      speed: 200,
    },
  ]);

  setControls(kirb);
  k.add(kirb);

  k.add([
    k.rect(1000, 50),
    k.pos(0, 500),
    k.area(),
    k.body({ isStatic: true }),
  ]);
});

k.go("level-1");
