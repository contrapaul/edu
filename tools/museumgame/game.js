// Phaser scene: loads the Tiled map, the sprite manifest, and wires the
// world to the DOM UI. Content lives in exhibits.json; the map is edited
// in Tiled (assets/map/museum.tmx -> exported museum.json). See EDITING.md.
(function () {
  const SPEED = 110;          // player walk speed, px/s
  const INTERACT_RADIUS = 40; // world px; ~2.5 tiles

  let player = null;
  let markers = [];           // {id, name, x, y} from the Tiled object layer
  let manifest = null;        // assets/sprites/sprites.json

  Promise.all([
    fetch('exhibits.json').then((r) => r.json()),
    fetch('assets/sprites/sprites.json').then((r) => r.json()),
  ]).then(([exhibits, sprites]) => {
    manifest = sprites;
    UI.init(exhibits.exhibits);
    Controls.init();
    boot();
  }).catch((err) => {
    document.getElementById('loading').textContent =
      'Failed to load museum data — check the browser console.';
    console.error('museumgame:', err);
  });

  function boot() {
    new Phaser.Game({
      type: Phaser.AUTO,
      parent: 'game',
      backgroundColor: '#141414',
      pixelArt: true,
      roundPixels: true,
      scale: {
        mode: Phaser.Scale.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
      },
      physics: { default: 'arcade' },
      scene: { preload, create, update },
    });
  }

  function preload() {
    this.load.tilemapTiledJSON('museum', 'assets/map/museum.json');
    this.load.image('interior', 'assets/tilesets/interior.png');
    this.load.image('props', 'assets/tilesets/props.png');
    manifest.sprites.forEach((s) => {
      this.load.spritesheet(s.key, s.file,
        { frameWidth: s.frameWidth, frameHeight: s.frameHeight });
    });
  }

  function create() {
    const map = this.make.tilemap({ key: 'museum' });
    const tilesets = [
      map.addTilesetImage('interior', 'interior'),
      map.addTilesetImage('props', 'props'),
    ];
    map.createLayer('ground', tilesets).setDepth(0);
    map.createLayer('decor', tilesets).setDepth(1);
    const walls = map.createLayer('walls', tilesets).setDepth(2);
    map.createLayer('overhead', tilesets).setDepth(10);
    walls.setCollisionByProperty({ collides: true });

    // Animations come from the manifest so new sprites need no code changes.
    manifest.sprites.forEach((s) => {
      (s.anims || []).forEach((a) => {
        this.anims.create({
          key: s.key + '-' + a.key,
          frames: this.anims.generateFrameNumbers(s.key, { frames: a.frames }),
          frameRate: a.frameRate,
          repeat: a.repeat,
        });
      });
    });

    // Object layer: spawn point, exhibit markers, decorative sprites.
    let spawn = { x: map.widthInPixels / 2, y: map.heightInPixels / 2 };
    markers = [];
    map.getObjectLayer('exhibits').objects.forEach((o) => {
      const props = {};
      (o.properties || []).forEach((p) => { props[p.name] = p.value; });
      if (o.name === 'spawn') {
        spawn = o;
      } else if (props.exhibit) {
        markers.push({ id: props.exhibit, name: o.name, x: o.x, y: o.y });
      } else if (props.sprite) {
        const def = manifest.sprites.find((s) => s.key === props.sprite);
        if (!def) {
          console.warn('museumgame: object references unknown sprite "' +
            props.sprite + '" — add it to assets/sprites/sprites.json');
          return;
        }
        const spr = this.add.sprite(o.x, o.y, def.key).setDepth(1.5);
        if (def.anims && def.anims.length) spr.play(def.key + '-' + def.anims[0].key);
      }
    });

    player = this.physics.add.sprite(spawn.x, spawn.y, 'player', 0).setDepth(5);
    player.body.setSize(12, 10).setOffset(2, 14); // collide with the feet only
    this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    player.setCollideWorldBounds(true);
    this.physics.add.collider(player, walls);

    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setZoom(3);
    cam.startFollow(player, true);

    const canvas = this.game.canvas;
    canvas.setAttribute('tabindex', '0'); // popup close returns focus here

    Controls.onInteract = () => {
      if (UI.popupOpen) UI.closePopup();
      else if (UI.nearest) UI.openExhibit(UI.nearest);
    };
    Controls.onAudio = () => {
      const ex = UI.popupOpen ? UI.current : UI.nearest;
      if (ex) UI.toggleAudio(ex);
    };
    Controls.onEscape = () => UI.closePopup();

    document.getElementById('loading').remove();

    // Debug/testing handle (used by the verification script; harmless to keep).
    window.MUSEUM = { scene: this, player, markers };
  }

  function update() {
    if (!player) return;
    let vx = 0;
    let vy = 0;
    if (!UI.popupOpen) {
      vx = (Controls.right ? 1 : 0) - (Controls.left ? 1 : 0);
      vy = (Controls.down ? 1 : 0) - (Controls.up ? 1 : 0);
    }
    const len = Math.hypot(vx, vy) || 1;
    player.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);

    if (vx || vy) {
      player.dir = Math.abs(vx) > Math.abs(vy)
        ? (vx > 0 ? 'right' : 'left')
        : (vy > 0 ? 'down' : 'up');
      player.anims.play('player-walk-' + player.dir, true);
    } else {
      player.anims.play('player-idle-' + (player.dir || 'down'), true);
    }

    let best = null;
    let bestDist = INTERACT_RADIUS;
    markers.forEach((m) => {
      const d = Math.hypot(m.x - player.x, m.y - player.y);
      if (d < bestDist) { bestDist = d; best = m; }
    });
    UI.setNearest(best);
  }
})();
