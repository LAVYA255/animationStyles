/* scene.js: the beats of this reel, on the narration's word times (WK.w / WK.ls / WK.le). */
const { w, ls, le, E, seg, clamp, lerp, arc, blink, talkOpen, speaking, shake, TR, el } = WK;
const D = WK.T.dur, F = Person.FACES, P = Person, Wd = World, FX = Rig.props;
WK.film({
  captions: [],
  cam: [[0, 1, 540, 960]],
  render(t, { world, fx, over }) { return {}; },
});
