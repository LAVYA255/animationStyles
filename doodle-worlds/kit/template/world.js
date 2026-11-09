/* world.js: this reel's world (cast looks, set, props), built on person.js + kit.js. World.sheet(svg) draws the asset sheet. */
(function (root) {
  const el = Person.el, K = Kit, INK = "#1d1b1a";
  const W = {};
  W.sheet = (s) => { K.txt(s, 1200, 70, "ASSET SHEET", 50, "#555"); };
  root.World = W;
})(window);
