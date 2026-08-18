import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./lib/supabaseClient";

/* ─────────────────────────  DATA  ───────────────────────── */

const EX = [
  // push
  { n: "Incline push-up", f: "push", e: "none", lv: 1, u: "reps", base: 12, note: "Hands on a bench or rail" },
  { n: "Push-up", f: "push", e: "none", lv: 1, u: "reps", base: 10, note: "Elbows 45°, body in one line" },
  { n: "Diamond push-up", f: "push", e: "none", lv: 2, u: "reps", base: 8, note: "Hands under sternum" },
  { n: "Archer push-up", f: "push", e: "none", lv: 3, u: "reps", base: 5, note: "One arm straight, chest to working hand" },
  { n: "Pike push-up", f: "push", e: "none", lv: 2, u: "reps", base: 8, note: "Hips high, crown to floor" },
  { n: "Dip", f: "push", e: "bar", lv: 2, u: "reps", base: 8, note: "Shoulders below elbows" },
  { n: "Ring dip", f: "push", e: "rings", lv: 3, u: "reps", base: 5, note: "Turn rings out at the top" },
  { n: "Pseudo planche push-up", f: "push", e: "none", lv: 3, u: "reps", base: 6, note: "Hands at hips, lean forward" },
  // pull
  { n: "Dead hang", f: "pull", e: "bar", lv: 1, u: "sec", base: 30, note: "Shoulders active, breathe" },
  { n: "Scapular pull-up", f: "pull", e: "bar", lv: 1, u: "reps", base: 8, note: "Arms stay straight" },
  { n: "Australian row", f: "pull", e: "bar", lv: 1, u: "reps", base: 12, note: "Feet elevated to make it harder" },
  { n: "Negative pull-up", f: "pull", e: "bar", lv: 1, u: "reps", base: 5, note: "5 seconds down" },
  { n: "Pull-up", f: "pull", e: "bar", lv: 2, u: "reps", base: 6, note: "Chin clears the bar, no kip" },
  { n: "Chin-up", f: "pull", e: "bar", lv: 2, u: "reps", base: 6, note: "Palms toward you" },
  { n: "Chest-to-bar", f: "pull", e: "bar", lv: 3, u: "reps", base: 4, note: "Pull the bar to your sternum" },
  { n: "Ring row", f: "pull", e: "rings", lv: 1, u: "reps", base: 12, note: "Squeeze the shoulder blades" },
  { n: "Explosive pull-up", f: "pull", e: "bar", lv: 3, u: "reps", base: 3, note: "Leave the bar at the top" },
  // legs
  { n: "Bodyweight squat", f: "legs", e: "none", lv: 1, u: "reps", base: 20, note: "Heels down, knees track toes" },
  { n: "Split squat", f: "legs", e: "none", lv: 2, u: "reps", base: 10, note: "Per leg" },
  { n: "Nordic curl negative", f: "legs", e: "none", lv: 3, u: "reps", base: 4, note: "Anchor your feet" },
  { n: "Shrimp squat", f: "legs", e: "none", lv: 3, u: "reps", base: 5, note: "Per leg" },
  { n: "Calf raise", f: "legs", e: "none", lv: 1, u: "reps", base: 20, note: "Off a step, full range" },
  { n: "Jump squat", f: "legs", e: "none", lv: 2, u: "reps", base: 12, note: "Land quiet" },
  // core
  { n: "Hollow hold", f: "core", e: "none", lv: 1, u: "sec", base: 30, note: "Lower back pressed flat" },
  { n: "Plank", f: "core", e: "none", lv: 1, u: "sec", base: 45, note: "Ribs down, glutes on" },
  { n: "Leg raise", f: "core", e: "none", lv: 2, u: "reps", base: 12, note: "Slow on the way down" },
  { n: "Hanging knee raise", f: "core", e: "bar", lv: 2, u: "reps", base: 10, note: "No swinging" },
  { n: "Toes to bar", f: "core", e: "bar", lv: 3, u: "reps", base: 6, note: "Compress, don't kick" },
  { n: "Tuck L-sit", f: "core", e: "parallettes", lv: 2, u: "sec", base: 20, note: "Push the floor away" },
  { n: "L-sit", f: "core", e: "parallettes", lv: 3, u: "sec", base: 10, note: "Legs locked, toes pointed" },
  { n: "Ab wheel rollout", f: "core", e: "none", lv: 3, u: "reps", base: 8, note: "Or use a towel on smooth floor" },
  // skill
  { n: "Wall handstand", f: "skill", e: "none", lv: 2, u: "sec", base: 30, note: "Chest to wall, stack the shoulders" },
  { n: "Handstand kick-up", f: "skill", e: "none", lv: 2, u: "reps", base: 5, note: "Practice bailing safely" },
  { n: "Crow pose", f: "skill", e: "none", lv: 1, u: "sec", base: 20, note: "Knees on triceps" },
  { n: "Tuck front lever", f: "skill", e: "bar", lv: 3, u: "sec", base: 12, note: "Straight arms, hips level" },
  { n: "Skin the cat", f: "skill", e: "rings", lv: 2, u: "reps", base: 4, note: "Slow through the bottom" },
  { n: "Support hold", f: "skill", e: "rings", lv: 2, u: "sec", base: 20, note: "Rings turned out" },
  // mobility
  { n: "Deep squat hold", f: "mobility", e: "none", lv: 1, u: "sec", base: 60, note: "Chest up, heels down" },
  { n: "Shoulder dislocate", f: "mobility", e: "none", lv: 1, u: "reps", base: 10, note: "Wide grip on a towel" },
  { n: "Wrist prep", f: "mobility", e: "none", lv: 1, u: "sec", base: 45, note: "Do this before any handstand work" },
  { n: "Couch stretch", f: "mobility", e: "none", lv: 1, u: "sec", base: 60, note: "Per side" },
  { n: "Thoracic bridge", f: "mobility", e: "none", lv: 2, u: "sec", base: 30, note: "Open the front of the hips" },
];

const mk = (n, s, u) => ({ n, s, u });

/* ─────────────────  LEVEL  ─────────────────
   The level someone picks at sign-up decides which sessions they're shown,
   how much volume the split gives them, and which exercises get swapped for
   something they can actually do today. */
const LVL_RANK = { Beginner: 1, Intermediate: 2, Advanced: 3 };
const rankOf = (l) => LVL_RANK[l] || 2;
const fit = (itemLvl, userLvl) => {
  const d = rankOf(itemLvl) - rankOf(userLvl);
  return d <= -1 ? "below" : d === 0 ? "match" : "above";
};

/* Beginner stand-ins, in order of preference. Ranked rather than single
   so a session doesn't end up with the same substitute three times. */
const EASIER = {
  "Archer push-up": ["Push-up", "Plank"],
  "Pseudo planche push-up": ["Diamond push-up", "Push-up"],
  "Diamond push-up": ["Push-up", "Incline push-up"],
  "Ring dip": ["Incline push-up", "Push-up"],
  "Dip": ["Incline push-up", "Plank"],
  "Pike push-up": ["Incline push-up", "Plank"],
  "Chest-to-bar": ["Australian row", "Negative pull-up"],
  "Explosive pull-up": ["Negative pull-up", "Australian row"],
  "Pull-up": ["Negative pull-up", "Australian row"],
  "Chin-up": ["Scapular pull-up", "Dead hang"],
  "Toes to bar": ["Hanging knee raise", "Leg raise"],
  "Hanging knee raise": ["Leg raise", "Hollow hold"],
  "Nordic curl negative": ["Bodyweight squat", "Calf raise"],
  "Shrimp squat": ["Split squat", "Bodyweight squat"],
  "Jump squat": ["Calf raise", "Bodyweight squat"],
  "Tuck front lever": ["Scapular pull-up", "Hollow hold"],
  "L-sit": ["Tuck L-sit", "Hollow hold"],
};
/* And the other direction, for people the default is too easy for. */
const HARDER = {
  "Incline push-up": ["Diamond push-up", "Push-up"],
  "Push-up": ["Archer push-up", "Diamond push-up"],
  "Australian row": ["Pull-up", "Negative pull-up"],
  "Negative pull-up": ["Pull-up", "Australian row"],
  "Bodyweight squat": ["Split squat", "Jump squat"],
  "Leg raise": ["Hanging knee raise", "Toes to bar"],
  "Plank": ["Hollow hold", "Leg raise"],
  "Split squat": ["Shrimp squat", "Jump squat"],
  "Tuck L-sit": ["L-sit", "Hanging knee raise"],
};

/* Scale a "4 × 12" or "3 × 45s" prescription.
   `mode` matters: if the exercise itself was swapped for something harder,
   the reps must come DOWN, not up — otherwise a beginner's 12 push-ups
   becomes 16 archer push-ups, which nobody can do. */
function scaleSet(str, level, mode) {
  const [a, b] = String(str).split("×").map((x) => x.trim());
  const sets = parseInt(a, 10) || 1;
  if (!b || /max/i.test(b)) return str;
  const secs = /s$/.test(b);
  const n = parseInt(b, 10);
  if (!n) return str;

  const r = rankOf(level);
  let repMul = r === 1 ? 0.6 : r === 3 ? 1.3 : 1;
  let setAdj = r === 1 ? -1 : 0;

  if (mode === "harder") { repMul = 0.55; setAdj = 0; }   // tougher move, fewer reps
  if (mode === "easier") { repMul = 1.15; setAdj = -1; }  // easier move, more reps

  const outSets = Math.max(2, sets + setAdj);
  const step = secs ? 5 : 1;
  const outReps = Math.max(secs ? 15 : 4, Math.round((n * repMul) / step) * step);
  return `${outSets} × ${outReps}${secs ? "s" : ""}`;
}

/* Swap the exercise when the default is out of reach — or too easy.
   `used` carries the names already in this session so we don't hand
   someone the same substitute three times in a row. */
const exBy = (n) => EX.find((e) => e.n.toLowerCase() === String(n).toLowerCase());

function forLevel(ex, level, used) {
  const r = rankOf(level);
  const opts = r === 1 ? EASIER[ex.n] : r === 3 ? HARDER[ex.n] : null;
  const pick = opts && (opts.find((o) => !used || !used.has(o)) || opts[0]);
  const mode = pick ? (r === 1 ? "easier" : "harder") : null;
  let out = scaleSet(ex.s, level, mode);

  /* A hold can't be prescribed in reps. If the swap crossed between reps and
     time, rebuild the prescription from the new exercise's own baseline. */
  if (pick) {
    const info = exBy(pick);
    const wantSecs = info && info.u === "sec";
    const gotSecs = /s\s*$/.test(out.split("×")[1] || "");
    if (info && wantSecs !== gotSecs) {
      const sets = parseInt(out, 10) || 3;
      const mul = r === 1 ? 0.7 : r === 3 ? 1.3 : 1;
      const step = wantSecs ? 5 : 1;
      const n = Math.max(wantSecs ? 15 : 4, Math.round((info.base * mul) / step) * step);
      out = `${sets} × ${n}${wantSecs ? "s" : ""}`;
    }
  }
  return { ...ex, n: pick || ex.n, s: out, swapped: !!pick };
}

/* There aren't five distinct beginner push exercises, so when a swap lands
   on something already in the session we don't repeat it — we fold the volume
   onto the existing entry. A beginner ends up with fewer movements and more
   sets of each, which is what they need anyway. */
function sessionFor(list, level) {
  const seen = new Map();
  const out = [];
  for (const e of list) {
    const o = forLevel(e, level, new Set(seen.keys()));
    if (seen.has(o.n)) {
      const at = seen.get(o.n);
      const [a, b] = String(out[at].s).split("×").map((x) => x.trim());
      const sets = parseInt(a, 10) || 1;
      if (b && !/max/i.test(b)) out[at] = { ...out[at], s: `${Math.min(sets + 1, 6)} × ${b}` };
    } else {
      seen.set(o.n, out.length);
      out.push(o);
    }
  }
  return out;
}

const WORKOUTS = [
  {
    id: "w1", t: "Pull-up strength", cat: "Pull", lvl: "Intermediate", min: 38, eq: "Bar",
    d: "Straight-arm scapular work into heavy strict pulls. Built to move your chest-to-bar number.",
    ex: [mk("Scapular pull-up", "3 × 8"), mk("Strict pull-up", "5 × 6"), mk("Chest-to-bar", "4 × 3"), mk("Australian row", "3 × 12"), mk("Hollow hold", "3 × 30s"), mk("Dead hang", "3 × max")],
  },
  {
    id: "w2", t: "Push foundations", cat: "Push", lvl: "Beginner", min: 24, eq: "None",
    d: "Volume on the basic push pattern. No equipment, no excuses.",
    ex: [mk("Incline push-up", "3 × 12"), mk("Push-up", "4 × 8"), mk("Pike push-up", "3 × 8"), mk("Plank", "3 × 45s")],
  },
  {
    id: "w3", t: "Full body circuit", cat: "Full Body", lvl: "Beginner", min: 30, eq: "None",
    d: "Four rounds, minimal rest. Good on days you don't want to think.",
    ex: [mk("Bodyweight squat", "4 × 20"), mk("Push-up", "4 × 10"), mk("Australian row", "4 × 12"), mk("Hollow hold", "4 × 30s"), mk("Jump squat", "4 × 12")],
  },
  {
    id: "w4", t: "Core under tension", cat: "Core & Abs", lvl: "Intermediate", min: 22, eq: "Bar",
    d: "Slow holds and compression. Everything that makes levers possible.",
    ex: [mk("Hollow hold", "4 × 40s"), mk("Hanging knee raise", "4 × 10"), mk("Leg raise", "3 × 12"), mk("Tuck L-sit", "4 × 20s"), mk("Plank", "3 × 60s")],
  },
  {
    id: "w5", t: "Legs, no weights", cat: "Legs", lvl: "Intermediate", min: 32, eq: "None",
    d: "Unilateral work and slow eccentrics. Your legs will know about it tomorrow.",
    ex: [mk("Split squat", "4 × 10"), mk("Shrimp squat", "3 × 5"), mk("Nordic curl negative", "3 × 4"), mk("Calf raise", "4 × 20"), mk("Deep squat hold", "2 × 60s")],
  },
  {
    id: "w6", t: "Handstand practice", cat: "Skill training", lvl: "Intermediate", min: 25, eq: "Wall",
    d: "Wrists first, then holds. Practise fresh — this is a skill session, not a burnout.",
    ex: [mk("Wrist prep", "2 × 45s"), mk("Crow pose", "4 × 20s"), mk("Wall handstand", "5 × 30s"), mk("Handstand kick-up", "4 × 5"), mk("Hollow hold", "3 × 30s")],
  },
  {
    id: "w7", t: "Upper body pump", cat: "Upper Body", lvl: "Intermediate", min: 35, eq: "Bar",
    d: "Push and pull supersets. High volume, short rest.",
    ex: [mk("Pull-up", "4 × 6"), mk("Dip", "4 × 8"), mk("Diamond push-up", "3 × 8"), mk("Ring row", "3 × 12"), mk("Pike push-up", "3 × 8")],
  },
  {
    id: "w8", t: "Front lever primer", cat: "Skill training", lvl: "Advanced", min: 34, eq: "Bar",
    d: "Straight-arm strength for the tuck front lever. Quality over reps.",
    ex: [mk("Scapular pull-up", "4 × 8"), mk("Tuck front lever", "6 × 12s"), mk("Toes to bar", "4 × 6"), mk("Chest-to-bar", "4 × 3"), mk("Hollow hold", "3 × 40s")],
  },
  {
    id: "w9", t: "Mobility reset", cat: "Mobility", lvl: "Beginner", min: 18, eq: "None",
    d: "For rest days. Hips, shoulders, wrists — the three things that stall people.",
    ex: [mk("Shoulder dislocate", "3 × 10"), mk("Deep squat hold", "3 × 60s"), mk("Couch stretch", "2 × 60s"), mk("Thoracic bridge", "3 × 30s"), mk("Wrist prep", "2 × 45s")],
  },
  {
    id: "w10", t: "Advanced push", cat: "Push", lvl: "Advanced", min: 36, eq: "Rings",
    d: "Planche-leaning push work. Expect to fail a set — that's the point.",
    ex: [mk("Pseudo planche push-up", "5 × 6"), mk("Ring dip", "4 × 5"), mk("Archer push-up", "4 × 5"), mk("Support hold", "4 × 20s"), mk("Diamond push-up", "3 × 8")],
  },
];

const PROGRAMS = [
  { id: "p1", free: true, t: "4-week Beginner", wk: 4, dw: 3, lvl: "Beginner", d: "Learn the six basic patterns and build the habit." },
  { id: "p2", free: false, t: "8-week Strength", wk: 8, dw: 4, lvl: "Intermediate", d: "Push, pull, legs, core on a rotating split." },
  { id: "p3", free: true, t: "Pull-up Program", wk: 6, dw: 3, lvl: "Beginner", d: "Zero to ten strict pull-ups." },
  { id: "p4", free: false, t: "Muscle-up Progression", wk: 10, dw: 3, lvl: "Advanced", d: "Explosive pulls, transition drills, straight-bar dips." },
  { id: "p5", free: false, t: "Handstand Program", wk: 8, dw: 5, lvl: "Intermediate", d: "Short daily practice to a 30-second freestanding hold." },
  { id: "p6", free: true, t: "Core Program", wk: 4, dw: 4, lvl: "Beginner", d: "Compression and hollow-body strength." },
  { id: "p7", free: false, t: "Full-body Program", wk: 6, dw: 3, lvl: "Intermediate", d: "One session, everything covered. For busy weeks." },
];

const SOFT_CAP = 3;

/* ─────────────────  SKILLS  ─────────────────
   A prerequisite graph, not a set of parallel lines — pull-ups feed the
   muscle-up, both levers and the flag, so the same skill has to be able to
   unlock several others. SKILLS is the registry; CHAINS are the display
   routes through it. */
const SKILLS = {
  // 🟢 Beginner
  pushup:   { n: "Push-up",            lvl: "Beginner", req: "3 × 20 full range",   pre: [] },
  diamond:  { n: "Diamond Push-up",    lvl: "Beginner", req: "3 × 12",              pre: ["pushup"] },
  pike:     { n: "Pike Push-up",       lvl: "Beginner", req: "3 × 10",              pre: ["pushup"] },
  aussie:   { n: "Australian Pull-up", lvl: "Beginner", req: "3 × 15 strict",       pre: [] },
  deadhang: { n: "Dead Hang",          lvl: "Beginner", req: "60s unbroken",        pre: [] },
  scap:     { n: "Scapular Pull-up",   lvl: "Beginner", req: "3 × 10, arms straight", pre: ["deadhang"] },
  pullup:   { n: "Pull-up",            lvl: "Beginner", req: "3 × 8 full range",    pre: ["scap"] },
  hollow:   { n: "Hollow Hold",        lvl: "Beginner", req: "60s, back flat",      pre: [] },
  wrists:   { n: "Wrist Prep",         lvl: "Beginner", req: "2 min, pain-free",    pre: [] },
  tuckl:    { n: "Tuck L-sit",         lvl: "Beginner", req: "30s",                 pre: ["hollow"] },
  crow:     { n: "Crow / Frog Stand",  lvl: "Beginner", req: "30s",                 pre: ["wrists", "hollow"] },
  wallhs:   { n: "Wall Handstand",     lvl: "Beginner", req: "60s chest-to-wall",   pre: ["pike", "wrists"] },

  // 🟡 Intermediate
  archerpush: { n: "Archer Push-up",     lvl: "Intermediate", req: "3 × 8 per side",   pre: ["diamond"] },
  archerpull: { n: "Archer Pull-up",     lvl: "Intermediate", req: "3 × 5 per side",   pre: ["pullup"] },
  ctb:        { n: "Chest-to-bar",       lvl: "Intermediate", req: "12 strict reps",   pre: ["pullup"] },
  explosive:  { n: "Explosive Pull-up",  lvl: "Intermediate", req: "Bar to sternum × 5", pre: ["ctb"] },
  lsit:       { n: "L-sit",              lvl: "Intermediate", req: "15s, legs locked", pre: ["tuckl"] },
  handstand:  { n: "Handstand",          lvl: "Intermediate", req: "15s freestanding", pre: ["wallhs"] },
  hstaps:     { n: "Handstand Taps",     lvl: "Intermediate", req: "10 controlled",    pre: ["handstand"] },
  tuckfl:     { n: "Tuck Front Lever",   lvl: "Intermediate", req: "20s",              pre: ["pullup", "hollow"] },
  tuckbl:     { n: "Tuck Back Lever",    lvl: "Intermediate", req: "20s",              pre: ["pullup"] },
  muprog:     { n: "Muscle-up Progression", lvl: "Intermediate", req: "Band-assisted × 3", pre: ["explosive"] },
  planchelean:{ n: "Planche Lean",       lvl: "Intermediate", req: "30s, shoulders past hands", pre: ["wrists", "diamond"] },

  // 🔴 Advanced
  muscleup:   { n: "Muscle-up",          lvl: "Advanced", req: "1 strict rep",        pre: ["muprog"] },
  hspu:       { n: "Handstand Push-up",  lvl: "Advanced", req: "1 freestanding rep",  pre: ["handstand", "pike"] },
  frontlever: { n: "Front Lever",        lvl: "Advanced", req: "5s",                  pre: ["tuckfl"] },
  backlever:  { n: "Back Lever",         lvl: "Advanced", req: "5s",                  pre: ["tuckbl"] },
  flag:       { n: "Human Flag",         lvl: "Advanced", req: "5s",                  pre: ["pullup", "pike"] },
  vsit:       { n: "Advanced L-sit / V-sit", lvl: "Advanced", req: "5s, legs above hips", pre: ["lsit"] },
  tuckplanche:{ n: "Tuck Planche",       lvl: "Advanced", req: "20s",                 pre: ["planchelean"] },
  straddleplanche: { n: "Straddle Planche", lvl: "Advanced", req: "8s",               pre: ["tuckplanche"] },
  oahs:       { n: "One-arm Handstand",  lvl: "Advanced", req: "5s per side",         pre: ["hstaps"] },
  oapushup:   { n: "One-arm Push-up",    lvl: "Advanced", req: "1 clean rep",         pre: ["archerpush"] },
};

/* Display routes. Steps with an `id` link back to the registry; the rest are
   drills that exist only inside a progression. */
const CHAINS = [
  {
    id: "muscleup", t: "Muscle-up", goal: "Muscle-up", tier: "Advanced",
    steps: [
      { id: "pullup", req: "10 controlled reps" },
      { id: "ctb" },
      { id: "explosive" },
      { n: "High pull-up", req: "Hips to bar height × 3" },
      { n: "Transition drill", req: "10 on a low bar" },
      { id: "muprog" },
      { id: "muscleup" },
    ],
  },
  {
    id: "handstand", t: "Handstand", goal: "Freestanding handstand", tier: "Intermediate",
    steps: [
      { n: "Wall plank", req: "45s, body straight" },
      { id: "pike", req: "3 × 10" },
      { id: "wallhs" },
      { n: "Kick-up practice", req: "10 controlled entries" },
      { id: "handstand" },
      { id: "hstaps" },
    ],
  },
  {
    id: "push", t: "Push", goal: "One-arm push-up", tier: "Beginner",
    steps: [
      { n: "Incline push-up", req: "3 × 15" },
      { id: "pushup" },
      { id: "diamond" },
      { id: "archerpush" },
      { n: "One-arm negative", req: "5 × 5s lower" },
      { id: "oapushup" },
    ],
  },
  {
    id: "lsit", t: "L-sit", goal: "V-sit", tier: "Intermediate",
    steps: [
      { n: "Foot-supported hold", req: "30s" },
      { id: "tuckl" },
      { n: "One-leg L-sit", req: "20s per side" },
      { id: "lsit" },
      { n: "High L-sit", req: "10s" },
      { id: "vsit" },
    ],
  },
  {
    id: "pull", t: "Pull", goal: "Archer pull-up", tier: "Beginner",
    steps: [
      { id: "deadhang" },
      { id: "aussie" },
      { id: "scap" },
      { id: "pullup" },
      { id: "archerpull" },
    ],
  },
  {
    id: "hspu", t: "Handstand push-up", goal: "Freestanding HSPU", tier: "Advanced", need: "pro",
    steps: [
      { id: "handstand" },
      { id: "hstaps" },
      { n: "Wall HSPU", req: "5 reps to the wall" },
      { n: "HSPU negative", req: "5 × 5s lower" },
      { id: "hspu" },
    ],
  },
  {
    id: "frontlever", t: "Front lever", goal: "Full front lever", tier: "Intermediate", need: "pro",
    steps: [
      { id: "hollow" },
      { id: "tuckfl" },
      { n: "Advanced tuck", req: "15s" },
      { n: "One-leg lever", req: "12s per side" },
      { n: "Straddle lever", req: "10s" },
      { id: "frontlever" },
    ],
  },
  {
    id: "backlever", t: "Back lever", goal: "Full back lever", tier: "Intermediate", need: "pro",
    steps: [
      { n: "Skin the cat", req: "5 controlled reps" },
      { id: "tuckbl" },
      { n: "Advanced tuck", req: "15s" },
      { n: "Straddle back lever", req: "10s" },
      { id: "backlever" },
    ],
  },
  {
    id: "planche", t: "Planche", goal: "Straddle planche", tier: "Advanced", need: "premium",
    steps: [
      { id: "planchelean" },
      { id: "crow", req: "30s" },
      { id: "tuckplanche" },
      { n: "Advanced tuck planche", req: "15s" },
      { id: "straddleplanche" },
    ],
  },
  {
    id: "flag", t: "Human flag", goal: "Full human flag", tier: "Advanced", need: "premium",
    steps: [
      { n: "Vertical flag hold", req: "20s" },
      { n: "Chamber hold", req: "15s" },
      { n: "Tuck flag", req: "10s" },
      { n: "Straddle flag", req: "8s" },
      { id: "flag" },
    ],
  },
  {
    id: "oahs", t: "One-arm handstand", goal: "One-arm handstand", tier: "Advanced", need: "premium",
    steps: [
      { id: "handstand", req: "45s freestanding" },
      { id: "hstaps", req: "20 controlled" },
      { n: "Weight shift", req: "10s on one arm, fingers assisting" },
      { n: "Two-finger assist", req: "8s per side" },
      { id: "oahs" },
    ],
  },
];

/* Seed progress for a fresh account. Real installs read this from logged tests. */
const SEED_PROGRESS = {
  pushup: "done", deadhang: "done", aussie: "done", scap: "done", hollow: "done",
  wrists: "done", diamond: "done", pike: "done", tuckl: "done",
  pullup: "done", wallhs: "done",
  ctb: { have: 8, need: 12 },
  planchelean: "done",
  crow: { have: 18, need: 30 },
  tuckfl: { have: 12, need: 20 },
  tuckbl: { have: 11, need: 20 },
  handstand: { have: 8, need: 15 },
  lsit: { have: 9, need: 15 },
  archerpush: { have: 5, need: 8 },
};

/* Resolve a chain step into something renderable. */
function stepInfo(step, progress) {
  const base = step.id ? SKILLS[step.id] : null;
  const n = step.n || (base && base.n) || "";
  const req = step.req || (base && base.req) || "";
  const lvl = (base && base.lvl) || null;
  const p = step.id ? progress[step.id] : undefined;
  const s = p === "done" ? "done" : p && typeof p === "object" ? "now" : "lock";
  return { key: step.id || n, n, req, lvl, s, have: p && p.have, need: p && p.need, id: step.id };
}

/* Prerequisites the athlete still owes for a given skill. */
function missingPre(id, progress) {
  const sk = SKILLS[id];
  if (!sk) return [];
  return sk.pre.filter((k) => progress[k] !== "done").map((k) => SKILLS[k].n);
}

const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced"];

/* ─────────────────  XP  ───────────────── */
const XP_AWARD = {
  workout: 100,   // finish a session
  skill: 50,      // log a skill practice
  pb: 100,        // new personal best
  week: 250,      // complete a programme week
  unlock: 500,    // clear a skill
};
const RANKS = [
  { min: 0, l: "Beginner" },
  { min: 2000, l: "Intermediate" },
  { min: 6000, l: "Advanced" },
  { min: 15000, l: "Elite" },
];
const rankFor = (xp) => [...RANKS].reverse().find((r) => xp >= r.min).l;
const levelFor = (xp) => Math.floor(xp / 700) + 1;

const PRS = [
  { n: "Strict pull-up", v: "11", u: "reps", d: "2 weeks ago", up: true },
  { n: "Push-up", v: "42", u: "reps", d: "5 days ago", up: true },
  { n: "Dead hang", v: "1:24", u: "", d: "Yesterday", up: true },
  { n: "Dip", v: "16", u: "reps", d: "3 weeks ago", up: false },
  { n: "Wall handstand", v: "1:02", u: "", d: "Last week", up: true },
  { n: "Tuck front lever", v: "14", u: "sec", d: "4 days ago", up: true },
];

const BADGES = [
  { n: "First rep", d: "Complete one workout", got: false },
  { n: "Ten in a row", d: "10-day streak", got: false },
  { n: "Century", d: "100 push-ups in a day", got: false },
  { n: "Bar rat", d: "25 pull sessions", got: false },
  { n: "Upside down", d: "60s wall handstand", got: false },
  { n: "Iron grip", d: "2-minute dead hang", got: false },
  { n: "Muscle-up", d: "Clear the muscle-up node", got: false },
  { n: "Unbroken", d: "50-day streak", got: false },
];

const MONTH = [22, 0, 38, 45, 0, 30, 26, 0, 40, 35, 24, 0, 0, 42, 38, 30, 0, 45, 28, 0, 36, 40, 0, 32, 45, 38, 0, 24, 45, 38, 0];

/* ─────────────────  YOUR DEMO CLIPS  ─────────────────
   Paste your hosted video URLs here. The key is the exercise name,
   lowercased with dashes. Anything left empty falls back to the
   placeholder, so you can ship exercises before their clip exists. */
const slug = (n) => n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const CLIPS = {
  "pull-up": "",              // e.g. "https://customer-xxx.cloudflarestream.com/<id>/downloads/default.mp4"
  "push-up": "",
  "dip": "",
  "australian-row": "",
  "hollow-hold": "",
  "dead-hang": "",
  "chest-to-bar": "",
  "scapular-pull-up": "",
  "pike-push-up": "",
  "wall-handstand": "",
};

const TESTS = [
  { k: "push", l: "Push", test: "Max push-ups", u: "reps", target: 50, prev: 31, val: 38, big: 5, cue: "Unbroken. Chest to fist height, full lockout at the top.", w: "w2" },
  { k: "pull", l: "Pull", test: "Max strict pull-ups", u: "reps", target: 15, prev: 8, val: 11, big: 2, cue: "Dead hang start, chin clears the bar. No kipping.", w: "w1" },
  { k: "legs", l: "Legs", test: "Squats in 2 minutes", u: "reps", target: 80, prev: 52, val: 61, big: 10, cue: "Hip crease below the knee on every rep.", w: "w5" },
  { k: "core", l: "Core", test: "Hollow hold", u: "sec", target: 90, prev: 38, val: 52, big: 10, cue: "Stop the clock the moment your lower back lifts.", w: "w4" },
  { k: "balance", l: "Balance", test: "Wall handstand", u: "sec", target: 90, prev: 34, val: 62, big: 10, cue: "Chest to wall. Stop when you come down.", w: "w6" },
  { k: "mobility", l: "Mobility", test: "Deep squat hold", u: "sec", target: 120, prev: 70, val: 78, big: 10, cue: "Heels flat, chest up, no holding on.", w: "w9" },
];

const score = (v, t) => Math.max(0, Math.min(Math.round((v / t) * 100), 100));

const TIERS = [
  { min: 85, l: "Elite", d: "You're in advanced-skill territory across the board." },
  { min: 65, l: "Strong", d: "Well past the basics. Static skills are the next frontier." },
  { min: 45, l: "Solid", d: "A real base. Now it's about closing the gap between areas." },
  { min: 25, l: "Developing", d: "The foundations are landing. Keep the frequency up." },
  { min: 0, l: "Foundation", d: "Everything from here is progress. Start with the basics." },
];
const tierOf = (n) => TIERS.find((t) => n >= t.min);

/* ─────────────────  SAVED PROGRESS  ─────────────────
   Everything the user earns lives under one key so a session only
   costs one read and one write. Storage can fail — never let that
   take the app down with it. */
const KEY = "skilxz:v1";

async function loadSave() {
  try {
    const r = window.localStorage.getItem(KEY);
    return r ? JSON.parse(r) : null;
  } catch {
    return null;
  }
}
async function writeSave(v) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(v));
    return true;
  } catch {
    return false;
  }
}
async function wipeSave() {
  try { window.localStorage.removeItem(KEY); } catch {}
}

const ago = (iso) => {
  const d = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  if (d < 14) return "Last week";
  return `${Math.floor(d / 7)} weeks ago`;
};

/* Real streak from logged history — a run of trained days ending today,
   plus a hit/miss map for the last 7 days. Empty history = 0, honestly. */
const streakFrom = (history) => {
  const days = new Set(history.map((h) => new Date(h.at).toDateString()));
  let streak = 0;
  const d = new Date();
  while (days.has(d.toDateString())) {
    streak++;
    d.setDate(d.getDate() - 1);
  }
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const day = new Date();
    day.setDate(day.getDate() - (6 - i));
    return days.has(day.toDateString()) ? 1 : 0;
  });
  return { streak, last7 };
};

/* ─────────────────────────  APP  ───────────────────────── */

export default function Skilxz() {
  const [tab, setTab] = useState("home");
  const [sheet, setSheet] = useState(null);
  const [player, setPlayer] = useState(null);
  const [on, setOn] = useState(false);
  const [reps, setReps] = useState(0);
  const [xp, setXp] = useState(0);
  const [done, setDone] = useState(0);
  const [toast, setToast] = useState(null);
  const [vals, setVals] = useState(() => Object.fromEntries(TESTS.map((t) => [t.k, t.val])));
  const [assess, setAssess] = useState(false);
  const [meals, setMeals] = useState(START_MEALS);
  const [numbers, setNumbers] = useState(true);
  const [theme, setTheme] = useState("limeneon");
  const [user, setUser] = useState(null);
  const [tier, setTier] = useState("free");
  const [tierEmail, setTierEmail] = useState(null);
  const [plansOpen, setPlansOpen] = useState(false);
  const [coach, setCoach] = useState(false);
  const [game, setGame] = useState(false);
  const [best, setBest] = useState(0);
  const [online, setOnline] = useState(typeof navigator === "undefined" ? true : navigator.onLine !== false);
  const [aiUsed, setAiUsed] = useState(0);
  const [aiReset, setAiReset] = useState(0);
  const [music, setMusic] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [ti, setTi] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [vol, setVol] = useState(0.7);
  const audio = useRef(null);
  const [core, setCore] = useState(false);
  const [exDetail, setExDetail] = useState(null);
  const [history, setHistory] = useState([]);
  const [splitDone, setSplitDone] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [hydrated, setHydrated] = useState(false);
  const [saveState, setSaveState] = useState("idle");
  const [pendingProfile, setPendingProfile] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setOn(true), 60);
    return () => clearTimeout(t);
  }, []);

  // Read saved progress once, then let the app take over.
  useEffect(() => {
    let dead = false;
    (async () => {
      const d = await loadSave();
      if (!dead && d) {
        if (d.user) setUser(d.user);
        if (d.theme) setTheme(d.theme);
        const savedEmail = String((d.user && d.user.email) || "").trim().toLowerCase();
        if (isComped(savedEmail)) setTier("life");
        else if (d.tier && d.tierEmail === savedEmail) setTier(d.tier === "master" ? "premium" : d.tier);
        else if (d.pro === true && d.tierEmail === savedEmail) setTier("pro"); // migrate old saves
        else setTier("free");
        if (typeof d.xp === "number") setXp(d.xp);
        if (typeof d.done === "number") setDone(d.done);
        if (typeof d.reps === "number") setReps(d.reps);
        if (typeof d.numbers === "boolean") setNumbers(d.numbers);
        if (d.vals) setVals(d.vals);
        if (Array.isArray(d.history)) setHistory(d.history);
        if (Array.isArray(d.splitDone)) setSplitDone(d.splitDone);
        if (Array.isArray(d.enrolled)) setEnrolled(d.enrolled);
        if (typeof d.best === "number") setBest(d.best);
        if (typeof d.aiUsed === "number") setAiUsed(d.aiUsed);
        if (typeof d.aiReset === "number") setAiReset(d.aiReset);
        if (d.tierEmail) setTierEmail(d.tierEmail);
        if (typeof d.best === "number") setBest(d.best);
        if (Array.isArray(d.meals)) setMeals(d.meals);
      }
      if (!dead) setHydrated(true);
    })();
    return () => { dead = true; };
  }, []);

  // Write back whenever anything earned changes. Debounced so rapid
  // taps (logging push-ups) don't fire a request per tap.
  useEffect(() => {
    if (!hydrated) return;
    setSaveState("saving");
    const t = setTimeout(async () => {
      const ok = await writeSave({ user, theme, tier, tierEmail, xp, done, reps, numbers, vals, history, splitDone, meals, enrolled, aiUsed, aiReset, best });
      setSaveState(ok ? "saved" : "error");
    }, 600);
    return () => clearTimeout(t);
  }, [hydrated, user, theme, tier, tierEmail, xp, done, reps, numbers, vals, history, splitDone, meals, enrolled, aiUsed, aiReset, best]);

  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  // Keep the element in step with the chosen track.
  useEffect(() => {
    const a = audio.current;
    if (!a || !tracks[ti]) return;
    if (a.src !== tracks[ti].url) a.src = tracks[ti].url;
    if (playing) a.play().catch(() => setPlaying(false));
    else a.pause();
  }, [ti, playing, tracks]);

  useEffect(() => { if (audio.current) audio.current.volume = vol; }, [vol]);

  // Drop to a quarter volume while the coach speaks, then come back up.
  useEffect(() => {
    duck.fn = (on) => { if (audio.current) audio.current.volume = on ? vol * 0.22 : vol; };
    return () => { duck.fn = null; };
  }, [vol]);

  useEffect(() => () => tracks.forEach((t) => URL.revokeObjectURL(t.url)), []);

  const skip = (d) => {
    if (!tracks.length) return;
    setTi((i) => (i + d + tracks.length) % tracks.length);
  };

  // Free coaching questions come back on a rolling 12-hour window.
  const AI_WINDOW = 12 * 60 * 60 * 1000;
  const openCoach = () => {
    if (Date.now() >= aiReset) { setAiUsed(0); setAiReset(Date.now() + AI_WINDOW); }
    setCoach(true);
  };
  const bumpAi = () => {
    setAiUsed((n) => n + 1);
    setAiReset((r) => (Date.now() >= r ? Date.now() + AI_WINDOW : r));
  };

  const start = (u) => {
    const email = String(u.email || "").trim().toLowerCase();
    setUser(u);
    if (isComped(email)) {
      setTier("life");
      setTierEmail(email);
      setToast("Founder account — Lifetime unlocked");
    } else if (u.tier && u.tier !== "free") {
      // Granted by a real purchase (Whop webhook), stored on the Supabase account.
      setTier(u.tier);
      setTierEmail(email);
    } else if (tierEmail !== email) {
      // A plan belongs to the account that bought it, not the handset.
      setTier("free");
      setTierEmail(email);
    }
    setPendingProfile(null);
  };

  // Pick up a real Supabase session — on load, and whenever sign-in/out
  // happens (password login, Google OAuth redirect, email verification).
  // If the account already has onboarding data saved, sign straight in;
  // otherwise route into the level/goal/why steps to collect it.
  useEffect(() => {
    if (!hydrated || user) return;
    let dead = false;
    const applySession = (session) => {
      if (dead || !session) return;
      const meta = session.user.user_metadata || {};
      const email = session.user.email;
      if (meta.lvl) {
        start({ name: meta.name || email.split("@")[0], email, lvl: meta.lvl, goal: meta.goal || [], why: meta.why || "", age: meta.age ?? null, tier: meta.tier });
      } else {
        setPendingProfile({ name: meta.name || email.split("@")[0], email });
      }
    };
    supabase.auth.getSession().then(({ data }) => applySession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) applySession(session);
      else setPendingProfile(null);
    });
    return () => { dead = true; sub.subscription.unsubscribe(); };
  }, [hydrated, user]);

  const finish = (w) => {
    const gained = XP_AWARD.workout;
    setPlayer(null);
    setSheet(null);
    setDone((d) => d + 1);
    setXp((x) => x + gained);
    setHistory((h) => [
      { id: Date.now(), t: w.t, cat: w.cat || "Session", min: w.min || w.ex.length * 6, xp: gained, at: new Date().toISOString() },
      ...h,
    ]);
    setToast(`${w.t} logged · +${gained} XP`);
    setTab("progress");
  };

  if (!user) {
    return (
      <div className={`skx ${theme}${on ? " on" : ""}`}>
        <style>{CSS}</style>
        <Auth start={start} pendingProfile={pendingProfile} />
      </div>
    );
  }

  const ctx = { sheet: setSheet, play: setPlayer, reps, setReps, xp, done, setToast, vals, retest: () => setAssess(true),
    meals, numbers, setNumbers,
    addMeal: (m) => setMeals((x) => [...x, m]),
    delMeal: (id) => setMeals((x) => x.filter((m) => m.id !== id)),
    theme, setTheme, user, signOut: () => { supabase.auth.signOut(); setUser(null); }, openEx: setExDetail,
    tier, pro: has(tier, "pro"), premium: has(tier, "premium"),
    caps: capsFor(user && typeof user.age === "number" ? user.age : 25),
    upgrade: () => { setTab("you"); setPlansOpen(true); },
    toMembership: () => { setTab("you"); setToast("Membership is in your profile"); },
    openCore: () => setCore(true),
    history, splitDone, setSplitDone, saveState, enrolled,
    enroll: (id) => setEnrolled((x) => (x.some((e) => e.id === id) ? x : [...x, { id, prog: 0 }])),
    drop: (id) => setEnrolled((x) => x.filter((e) => e.id !== id)),
    restart: (id) => setEnrolled((x) => x.map((e) => (e.id === id ? { ...e, prog: 0 } : e))),
    openMusic: () => setMusic(true),
    openGame: () => setGame(true),
    online, best,
    setWhy: (w) => setUser((u) => ({ ...u, why: w })),
    progress: SEED_PROGRESS,
    addXp: (n) => setXp((v) => v + n),
    setLevel: (l) => setUser((u) => ({ ...u, lvl: l })),
    reset: async () => { await wipeSave(); window.location.reload(); } };

  return (
    <div className={`skx ${theme}${on ? " on" : ""}`}>
      <style>{CSS}</style>
      <div className="phone">
        <Header xp={xp} user={user} tier={tier} upgrade={() => { setTab("you"); }} />
        {tab === "home" && <Home {...ctx} />}
        {tab === "train" && <Train {...ctx} />}
        {tab === "skills" && <Skills {...ctx} />}
        {tab === "fuel" && (ctx.caps.fuel ? <Fuel {...ctx} /> : <Home {...ctx} />)}
        {tab === "progress" && <Progress {...ctx} done={done} />}
        {tab === "you" && <You {...ctx} />}
        <Nav tab={tab} set={setTab} caps={ctx.caps} />
      </div>

      {sheet && <Sheet data={sheet} close={() => setSheet(null)} play={setPlayer} setToast={setToast} openEx={setExDetail} />}
      {player && <Player w={player} close={() => setPlayer(null)} finish={finish} openEx={setExDetail} openMusic={() => setMusic(true)} />}
      {exDetail && <ExerciseDetail ex={exDetail} close={() => setExDetail(null)} play={setPlayer} />}
      {assess && (
        <Assess
          vals={vals}
          close={() => setAssess(false)}
          save={(v) => {
            setVals(v);
            setAssess(false);
            setTab("progress");
            setXp((x) => x + 120);
            setToast("Assessment saved · +120 XP");
          }}
        />
      )}
      {core && (
        <Core
          close={() => setCore(false)}
          tier={tier}
          used={aiUsed}
          streak={12}
          score={Math.round(TESTS.map((t) => score(vals[t.k], t.target)).reduce((a, b) => a + b, 0) / TESTS.length)}
          days={history.length}
          upgrade={() => { setCore(false); setPlansOpen(true); }}
          open={(k) => {
            setCore(false);
            if (k === "coach") setCoach(true);
            else if (k === "build") { setTab("train"); setToast("Train → Split · tap Generator"); }
            else if (k === "skills") setTab("skills");
            else if (k === "scan") { setTab("fuel"); setToast("Fuel → Scan a meal"); }
            else if (k === "stats") setTab("progress");
            else if (k === "voice") setToast("Voice coach lives in the workout player");
            else if (k === "plan") setToast("Weekly plan builds from your next assessment");
            else if (k === "form") setToast("Form check — record a set and send it in");
          }}
        />
      )}
      <audio ref={audio} onEnded={() => skip(1)} />
      {game && <BarWork close={() => setGame(false)} best={best} setBest={setBest} />}
      {music && (
        <Music
          close={() => setMusic(false)}
          tracks={tracks} setTracks={setTracks} ti={ti} setTi={setTi}
          playing={playing} setPlaying={setPlaying} vol={vol} setVol={setVol} skip={skip}
        />
      )}
      {coach && (
        <Coach
          close={() => setCoach(false)}
          user={user} tier={tier} history={history} vals={vals} splitDone={splitDone}
          aiUsed={aiUsed} bumpAi={bumpAi} aiReset={aiReset}
          toMembership={() => { setCoach(false); setTab("you"); setToast("Membership is in your profile"); }}
        />
      )}
      {plansOpen && (
        <Plans
          user={user}
          close={() => setPlansOpen(false)}
          tier={tier}
          buy={(plan) => { setTier(plan.k); setTierEmail(String(user.email || "").trim().toLowerCase()); setPlansOpen(false); setToast(`Skilxz ${plan.l} active`); }}
          setToast={setToast}
        />
      )}
      {!coach && !core && !plansOpen && !player && !assess && (
        <button className="fab" onClick={() => setCore(true)} aria-label="Open the AI core">
          <Mark size={19} />
          <span>Core</span>
        </button>
      )}
      <div className="grain" aria-hidden="true" />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ─────────────────  SHARED CHROME  ───────────────── */

/* The mark: a bar, arms up to the grip, legs straddled below.
   Reads as an X at any size; as a body in a straddle hold at large ones. */
function Mark({ size = 22, glow = true }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} className={glow ? "mark-svg glowline" : "mark-svg"} aria-hidden="true">
      <rect x="14" y="18" width="72" height="9" rx="4.5" fill="currentColor" />
      <path d="M32 27 L50 57 L68 27" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 85 L50 57 L74 85" fill="none" stroke="currentColor" strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Logo({ size = 22, word = true }) {
  return (
    <span className="logo" style={{ "--ls": `${size}px` }}>
      <span className="logomark"><Mark size={size} /></span>
      {word && <span className="logoword">SKIL<span>X</span>Z</span>}
    </span>
  );
}

const initials = (n) => n.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

function Header({ xp, user }) {
  const lvl = Math.floor(xp / 700);
  const into = (xp % 700) / 700;
  return (
    <header className="top">
      <Logo size={21} />
      <div className="lvl">
        <div className="lvlnum">
          LVL {lvl}
          <span className="lvlbar"><i style={{ width: `${into * 100}%` }} /></span>
        </div>
        <div className="av">{initials(user.name)}</div>
      </div>
    </header>
  );
}

function Nav({ tab, set, caps }) {
  const tabs = [
    { k: "home", l: "Home", p: "M3 8l7-5 7 5v8a1 1 0 01-1 1H4a1 1 0 01-1-1z" },
    { k: "train", l: "Train", p: "M4 7v6M16 7v6M2 10h16M7 5v10M13 5v10" },
    { k: "skills", l: "Skills", p: "M10 2v5M10 13v5M5 10h10M4.5 4.5l3 3M15.5 4.5l-3 3M4.5 15.5l3-3M15.5 15.5l-3-3" },
    { k: "fuel", l: "Fuel", p: "M4 3v6a3 3 0 006 0V3M7 9v8M14 3c-1.2 1.6-1.6 3.4-1.6 5.2 0 1.6.7 2.6 2 2.8V17M16.4 3v14" },
    { k: "progress", l: "Stats", p: "M3 16V9M8 16V4M13 16v-5M18 16v-9" },
    { k: "you", l: "You", p: "M10 10a3.2 3.2 0 100-6.4A3.2 3.2 0 0010 10zM3.6 17a6.6 6.6 0 0112.8 0" },
  ];
  return (
    <nav className="nav">
      {tabs.filter((t) => t.k !== "fuel" || caps.fuel).map((t) => (
        <button key={t.k} className={`tab${tab === t.k ? " act" : ""}`} onClick={() => set(t.k)} aria-current={tab === t.k}>
          <svg className="glyph" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <path d={t.p} />
          </svg>
          {t.l}
        </button>
      ))}
    </nav>
  );
}

function Head({ l, r }) {
  return (
    <div className="head">
      <span className="eyebrow">{l}</span>
      <span className="knurl" aria-hidden="true" />
      {r && <span className="eyebrow">{r}</span>}
    </div>
  );
}

function Ring({ pct, size = 76, w = 5, label, sub, on = true }) {
  const r = size / 2 - w;
  const c = 2 * Math.PI * r;
  return (
    <div className="ringwrap" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#252529" strokeWidth={w} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--neon)" strokeWidth={w}
          className="glowline"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={on ? c * (1 - pct) : c}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dashoffset 1.1s cubic-bezier(.2,.8,.2,1)" }}
        />
      </svg>
      <div className="ringtxt"><div><b>{label}</b>{sub && <i>{sub}</i>}</div></div>
    </div>
  );
}

/* ─────────────────  HOME  ───────────────── */

function Home({ sheet, play, reps, setReps, openCore, openGame, online, user, history, done }) {
  const { streak, last7 } = streakFrom(history);
  const [exp, setExp] = useState(false);
  const [node, setNode] = useState(3);
  const lvl = (user && user.lvl) || "Intermediate";
  const pool = WORKOUTS.filter((x) => x.lvl === lvl);
  const dayIndex = Math.floor(Date.now() / 86400000);
  const base = (pool.length ? pool : WORKOUTS)[dayIndex % (pool.length || WORKOUTS.length)];
  const w = { ...base, lvl, ex: sessionFor(base.ex, lvl) };
  const route = CHAINS[0];
  const rail = route.steps.map((st) => stepInfo(st, SEED_PROGRESS));
  const n = rail[Math.min(node, rail.length - 1)];
  const GOAL = 100;
  const cdone = reps >= GOAL;

  return (
    <main>
      {!online && (
        <button className="offbar rise d1" onClick={openGame}>
          <span className="offdot" />
          <span>
            <b>You're offline.</b> Saved workouts still run — or play Bar Work while you wait.
          </span>
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M4 2l4 4-4 4" /></svg>
        </button>
      )}

      <div className="streak rise d1">
        <div className="stnum"><b>{streak}</b><span className="eyebrow">day streak</span></div>
        <div className="dots">
          {last7.map((h, i) => (
            <span key={i} className={`dot${h ? " hit" : i === 6 ? " now" : ""}`} />
          ))}
        </div>
      </div>

      <div className="rise d2"><Head l="Today" r={new Date().toLocaleDateString(undefined, { weekday: "long" })} /></div>

      <section className="card rise d2">
        <div className="herotop">
          <div>
            <span className="tag">{w.cat}</span>
            <h2 className="disp herotitle">{w.t}</h2>
            <p className="meta">{w.ex.length} exercises · {w.min} min · {w.eq} · {lvl}</p>
          </div>
          <Ring pct={done / 24} label={`${done}/24`} sub="sessions" />
        </div>

        <button className="btn primary" onClick={() => play(w)}>Start workout</button>

        <button className="peek" onClick={() => setExp((e) => !e)} aria-expanded={exp}>
          {exp ? "Hide exercises" : "See exercises"}
          <svg className={`chev${exp ? " up" : ""}`} width="11" height="7" viewBox="0 0 11 7" fill="none">
            <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className={`collapse${exp ? " open" : ""}`}>
          <div style={{ paddingTop: 8 }}>
            {w.ex.map((x, i) => (
              <div className="row" key={`${i}-${x.n}`}>
                <span className="ix">{String(i + 1).padStart(2, "0")}</span>
                <div className="rn">{x.n}</div>
                <span className="rs">{x.s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="rise d3"><Head l="Next unlock" r={`${route.t} → ${route.goal}`} /></div>
      <section className="card rise d3">
        <Rail nodes={rail} active={node} set={setNode} />
        <div className="detail">
          <div className="dname">{n.n}</div>
          <div className="dreq">
            {n.s === "done"
              ? `Cleared · ${n.req || "logged"}`
              : n.s === "lock"
                ? `Locked · clear ${(rail[Math.max(node - 1, 0)] || {}).n || "the step before"} first`.toLowerCase()
                : n.req || "In progress"}
          </div>
          {n.s === "now" && (
            <>
              <div className="bar"><i style={{ width: `${(n.have / n.need) * 100}%` }} /></div>
              <div className="barlab">
                <span><b>{n.have}</b> of {n.need} strict reps</span>
                <span>{n.need - n.have} to go</span>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="rise d4"><Head l="Daily challenge" r="Resets at midnight" /></div>
      <section className={`card rise d4${cdone ? " lit" : ""}`}>
        <div className="disp cbig">{reps}<em>/ {GOAL} push-ups</em></div>
        <div className="bar" style={{ marginTop: 14 }}><i style={{ width: `${Math.min(reps / GOAL, 1) * 100}%` }} /></div>
        {cdone ? (
          <div className="cdone">Challenge complete · +150 XP</div>
        ) : (
          <div className="btnrow">
            {[5, 10, 20].map((k) => (
              <button key={k} className="btn ghost" onClick={() => setReps((r) => Math.min(r + k, GOAL))}>+{k}</button>
            ))}
            <button className="btn ghost" onClick={() => setReps(GOAL)}>Finish</button>
          </div>
        )}
      </section>

      <button className="gencard rise d5" onClick={openCore} style={{ marginBottom: 24 }}>
        <div>
          <span className="tag">Coach</span>
          <div className="disp gentitle">The<br />Core</div>
          <p className="meta" style={{ marginTop: 8 }}>Every AI tool in one place — coach, generator, form check, scan.</p>
        </div>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 5.5h14v10H11l-4 3.5V15.5H4z" />
        </svg>
      </button>

      <div className="rise d5"><Head l="Recommended" r="Based on your week" /></div>
      <div className="rise d5">
        {[WORKOUTS[8], WORKOUTS[5]].map((k) => (
          <WCard key={k.id} w={k} open={sheet} />
        ))}
      </div>
    </main>
  );
}

function Rail({ nodes, active, set }) {
  return (
    <div className="track">
      {nodes.map((n, i) => (
        <React.Fragment key={n.n}>
          {i > 0 && <span className={`seg${nodes[i - 1].s === "done" && n.s !== "lock" ? " filled" : n.s === "lock" ? " dash" : ""}`} />}
          <button className={`nd ${n.s}${active === i ? " sel" : ""}`} onClick={() => set(i)} aria-label={`${n.n}, ${n.s === "done" ? "cleared" : n.s === "now" ? "in progress" : "locked"}`}>
            {n.s === "done" && (
              <svg className="tick" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.4 2.4L9.5 3.6" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            )}
            {n.s === "now" && <span className="pip" />}
            {n.s === "lock" && <span className="lockdot" />}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

function WCard({ w, open, userLvl }) {
  const rel = userLvl ? fit(w.lvl, userLvl) : "match";
  return (
    <button className="wcard" onClick={() => open(w)}>
      <div>
        <div className="wtitle">{w.t}</div>
        <div className="wmeta">{w.lvl} · {w.min} min · {w.eq}</div>
      </div>
      <span className="wcat">{w.cat}</span>
    </button>
  );
}

/* ─────────────────  TRAIN  ───────────────── */

const CATS = ["All", "Push", "Pull", "Legs", "Core & Abs", "Full Body", "Upper Body", "Skill training", "Mobility"];
const LVLS = ["Any level", "Beginner", "Intermediate", "Advanced"];

function Train({ sheet, play, setToast, openEx, pro, toMembership, splitDone, setSplitDone, enrolled, enroll, drop, restart, user, setLevel }) {
  const [mode, setMode] = useState("split");
  const [cat, setCat] = useState("All");
  const [lvl, setLvl] = useState((user && user.lvl) || "Any level");
  const [gen, setGen] = useState(false);

  const list = WORKOUTS.filter(
    (w) => (cat === "All" || w.cat === cat) && (lvl === "Any level" || w.lvl === lvl)
  );

  return (
    <main>
      <div className="seg2 four rise d1">
        <button className={mode === "split" ? "act" : ""} onClick={() => setMode("split")}>Split</button>
        <button className={mode === "workouts" ? "act" : ""} onClick={() => setMode("workouts")}>Workouts</button>
        <button className={mode === "programs" ? "act" : ""} onClick={() => setMode("programs")}>Programs</button>
        <button className={mode === "library" ? "act" : ""} onClick={() => setMode("library")}>Moves</button>
      </div>

      {mode === "split" && <Split play={play} setToast={setToast} splitDone={splitDone} setSplitDone={setSplitDone} user={user} setLevel={setLevel} />}
      {mode === "library" && <Library openEx={openEx} />}
      {mode === "workouts" && (
        <>
          <button className="gencard rise d2" onClick={() => setGen(true)}>
            <div>
              <span className="tag">Generator</span>
              <div className="disp gentitle">Build me<br />a session</div>
              <p className="meta" style={{ marginTop: 8 }}>Tell it your time and equipment. It writes the workout.</p>
            </div>
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
              <path d="M5 11h12M12 6l5 5-5 5" />
            </svg>
          </button>

          <div className="chips rise d3">
            {CATS.map((c) => (
              <button key={c} className={`chip${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>{c}</button>
            ))}
          </div>
          <div className="chips rise d3" style={{ marginBottom: 18 }}>
            {LVLS.map((c) => (
              <button key={c} className={`chip sm${lvl === c ? " on" : ""}`} onClick={() => setLvl(c)}>{c}</button>
            ))}
          </div>

          <div className="rise d4">
            <Head l={`${list.length} workout${list.length === 1 ? "" : "s"}`} />
            {lvl !== "Any level" && (
              <p className="fine" style={{ textAlign: "left", margin: "0 0 12px" }}>
                Matched to your level. Tap <b>Any level</b> to see everything.
              </p>
            )}
            {list.length === 0 ? (
              <div className="empty">
                Nothing matches those two filters yet.
                <button className="btn outline" onClick={() => { setCat("All"); setLvl("Any level"); }}>Clear filters</button>
              </div>
            ) : (
              list.map((w) => <WCard key={w.id} w={w} open={sheet} userLvl={user && user.lvl} />)
            )}
          </div>
        </>
      )}
      {mode === "programs" && (
        <Programs
          setToast={setToast} pro={pro} toMembership={toMembership}
          enrolled={enrolled} enroll={enroll} drop={drop} restart={restart}
        />
      )}

      {gen && <Generator close={() => setGen(false)} play={play} pro={pro} toMembership={toMembership} />}
    </main>
  );
}

function Programs({ setToast, pro, toMembership, enrolled, enroll, drop, restart }) {
  const on = enrolled.map((e) => ({ ...e, p: PROGRAMS.find((x) => x.id === e.id) })).filter((e) => e.p);
  const running = on.filter((e) => e.prog < 1);
  const finished = on.filter((e) => e.prog >= 1);
  const rest = PROGRAMS.filter((p) => !on.some((e) => e.id === p.id));
  const over = running.length > SOFT_CAP;

  return (
    <div className="rise d2">
      <section className="card">
        <div className="herotop">
          <div>
            <span className="tag">Your plan</span>
            <h2 className="disp herotitle">{running.length} running</h2>
            <p className="meta">
              {running.length === 0
                ? "Nothing active. Start as many as you like below."
                : running.map((e) => e.p.t).join(" · ")}
            </p>
          </div>
          <Ring pct={running.length ? running.reduce((a, e) => a + e.prog, 0) / running.length : 0}
                label={`${Math.round((running.reduce((a, e) => a + e.prog, 0) / (running.length || 1)) * 100)}%`} sub="average" />
        </div>
        {over && (
          <p className="fine warn" style={{ textAlign: "left", marginTop: 14 }}>
            Four or more at once usually means none of them progress. Two is the sweet spot — one strength block
            and one skill programme.
          </p>
        )}
      </section>

      {running.length > 0 && (
        <>
          <Head l="Running now" r={`${running.length} active`} />
          {running.map((e) => (
            <PCard key={e.id} p={e.p} prog={e.prog} joined setToast={setToast} pro={pro} toMembership={toMembership} drop={drop} restart={restart} enroll={enroll} />
          ))}
        </>
      )}

      {finished.length > 0 && (
        <>
          <Head l="Completed" r={`${finished.length}`} />
          {finished.map((e) => (
            <PCard key={e.id} p={e.p} prog={1} joined setToast={setToast} pro={pro} toMembership={toMembership} drop={drop} restart={restart} enroll={enroll} />
          ))}
        </>
      )}

      <Head l="Add another" r={`${rest.length} available`} />
      {rest.map((p) => (
        <PCard key={p.id} p={p} prog={0} setToast={setToast} pro={pro} toMembership={toMembership} drop={drop} restart={restart} enroll={enroll} />
      ))}
    </div>
  );
}

function PCard({ p, prog = 0, joined, setToast, pro, toMembership, enroll, drop, restart }) {
  const locked = !p.free && !pro;
  const state = prog >= 1 ? "Completed" : prog > 0 ? `Week ${Math.ceil(prog * p.wk)} of ${p.wk}` : `${p.wk} weeks · ${p.dw}×/week`;

  const main = () => {
    if (locked) return toMembership();
    if (prog >= 1) { restart(p.id); setToast(`${p.t} restarted`); return; }
    if (joined) { setToast(`${p.t} — continuing`); return; }
    enroll(p.id);
    setToast(`${p.t} added to your plan`);
  };

  return (
    <div className={`pcard${joined && prog < 1 ? " lit" : ""}`}>
      <div className="ptop">
        <div style={{ minWidth: 0 }}>
          <div className="wtitle">{p.t}</div>
          <div className="wmeta">{p.lvl} · {state}</div>
        </div>
        {p.free ? <span className="wcat">Free</span> : <span className="wcat pro">Pro</span>}
      </div>
      <p className="pdesc">{p.d}</p>
      {prog > 0 && prog < 1 && <div className="bar"><i style={{ width: `${prog * 100}%` }} /></div>}
      <button className={`btn ${joined && prog < 1 ? "primary" : "outline"}`} onClick={main}>
        {locked ? "On Pro — open Membership" : prog >= 1 ? "Run it again" : joined ? "Continue" : "Add to my plan"}
      </button>
      {joined && (
        <button className="peek" onClick={() => { drop(p.id); setToast(`${p.t} removed`); }}>
          Remove from plan
        </button>
      )}
    </div>
  );
}

function Split({ play, setToast, splitDone: done, setSplitDone: setDone, user, setLevel }) {
  const lvl = (user && user.lvl) || "Intermediate";
  const days = PPL[lvl] || PPL.Intermediate;
  const [open, setOpen] = useState(new Date().getDay() ? new Date().getDay() - 1 : null);
  const pct = done.length / days.length;
  const today = (new Date().getDay() + 6) % 7; // Mon = 0

  return (
    <div className="rise d2">
      <section className="card">
        <div className="herotop">
          <div>
            <span className="tag">6-day PPL + Core</span>
            <h2 className="disp herotitle">Push · Pull<br />Legs ×2</h2>
            <p className="meta">Six sessions, one rest day. Written for {lvl.toLowerCase()}s.</p>
          </div>
          <Ring pct={pct} label={`${done.length}/6`} sub="this week" />
        </div>

        <div className="weekstrip">
          {WEEK_DAYS.map((d, i) => {
            const day = days[i];
            return (
              <div key={d} className={`wcol${i === today ? " today" : ""}`}>
                <span className="wlab">{d}</span>
                <span
                  className={`wpip${done.includes(i) ? " done" : ""}${day ? "" : " rest"}`}
                  style={day ? { borderColor: TYPE_TINT[day.k], background: done.includes(i) ? TYPE_TINT[day.k] : "transparent" } : undefined}
                />
                <span className="wtype">{day ? day.k : "Rest"}</span>
              </div>
            );
          })}
        </div>

        <div className="lvlpick">
          <span className="eyebrow">Progression</span>
          <div className="chips" style={{ marginTop: 9, marginBottom: 0 }}>
            {["Beginner", "Intermediate", "Advanced"].map((k) => (
              <button key={k} className={`chip sm${lvl === k ? " on" : ""}`}
                onClick={() => { setLevel(k); setToast(`Loaded the ${k.toLowerCase()} programme`); }}>
                {k}
              </button>
            ))}
          </div>
        </div>
      </section>

      {days.map((d, i) => {
        const isDone = done.includes(i);
        const isOpen = open === i;
        return (
          <section key={d.d} className={`card daycard${isDone ? " lit" : ""}`}>
            <button className="dayhead" onClick={() => setOpen(isOpen ? null : i)} aria-expanded={isOpen}>
              <span className={`daynum${isDone ? " done" : ""}`} style={!isDone ? { borderColor: TYPE_TINT[d.k] } : undefined}>
                {isDone ? (
                  <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.4 2.4L9.5 3.6" stroke="var(--void)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                ) : d.d.slice(0, 2)}
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span className="dayt">{d.t}</span>
                <span className="dayf">{d.min} min · {d.ex.length} exercises{i === today ? " · today" : ""}</span>
              </span>
              <svg className={`chev${isOpen ? " up" : ""}`} width="11" height="7" viewBox="0 0 11 7" fill="none">
                <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>

            {isOpen && (
              <>
                <div style={{ paddingTop: 6 }}>
                  {d.ex.map((x, k) => (
                    <div className="row" key={`${k}-${x.n}`}>
                      <span className="ix">{String(k + 1).padStart(2, "0")}</span>
                      <div className="rn">{x.n}</div>
                      <span className="rs">{x.s}</span>
                    </div>
                  ))}
                </div>
                <button className="btn primary" onClick={() => play({ ...d, t: d.t, cat: d.k, lvl, eq: "Bar", ex: d.ex })}>
                  Start {d.t.toLowerCase()}
                </button>
                <button className="btn outline"
                  onClick={() => { setDone((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i])); setToast(isDone ? "Marked incomplete" : `${d.t} done`); }}>
                  {isDone ? "Mark incomplete" : "Mark as done"}
                </button>
              </>
            )}
          </section>
        );
      })}

      <section className="card restcard">
        <div className="dayhead" style={{ cursor: "default" }}>
          <span className="daynum rest">SU</span>
          <span style={{ flex: 1 }}>
            <span className="dayt">Rest</span>
            <span className="dayf">Walk, stretch, eat. This is when you actually adapt.</span>
          </span>
        </div>
      </section>
    </div>
  );
}

/* ─────────────────  GENERATOR  ───────────────── */

const TIMES = [15, 30, 45];
const EQUIP = [
  { k: "none", l: "Nothing" },
  { k: "bar", l: "Pull-up bar" },
  { k: "rings", l: "Rings" },
  { k: "parallettes", l: "Parallettes" },
];
const FOCI = [
  { k: "full", l: "Full body" }, { k: "push", l: "Push" }, { k: "pull", l: "Pull" },
  { k: "legs", l: "Legs" }, { k: "core", l: "Core" }, { k: "skill", l: "Skill" },
];

function build(min, eq, focus) {
  const has = new Set(["none", ...eq]);
  let pool = EX.filter((x) => has.has(x.e) && x.f !== "mobility");
  if (focus !== "full") pool = pool.filter((x) => x.f === focus);
  const count = min <= 15 ? 4 : min <= 30 ? 5 : 6;
  const picked = [];
  const groups = focus === "full" ? ["pull", "push", "legs", "core", "skill", "push"] : [focus];
  let gi = 0;
  while (picked.length < count && pool.length) {
    const want = groups[gi % groups.length];
    gi++;
    const opts = pool.filter((x) => (focus === "full" ? x.f === want : true) && !picked.includes(x));
    const from = opts.length ? opts : pool.filter((x) => !picked.includes(x));
    if (!from.length) break;
    picked.push(from[Math.floor(Math.random() * from.length)]);
  }
  const ORDER = { skill: 0, pull: 1, push: 2, legs: 3, core: 4 };
  picked.sort((a, b) => (ORDER[a.f] ?? 9) - (ORDER[b.f] ?? 9) || a.lv - b.lv);
  const sets = min <= 15 ? 3 : min <= 30 ? 3 : 4;
  return {
    id: "gen", t: "Your session", cat: FOCI.find((f) => f.k === focus).l, lvl: "Generated",
    min, eq: eq.length ? EQUIP.filter((e) => eq.includes(e.k)).map((e) => e.l).join(" + ") : "None",
    d: "Generated for the time and equipment you have right now.",
    ex: picked.map((x) => mk(x.n, `${sets} × ${x.base}${x.u === "sec" ? "s" : ""}`)),
  };
}

function Generator({ close, play, pro, toMembership }) {
  const [min, setMin] = useState(30);
  const [eq, setEq] = useState(["bar"]);
  const [focus, setFocus] = useState("pull");
  const [out, setOut] = useState(null);

  const toggle = (k) => setEq((e) => (e.includes(k) ? e.filter((x) => x !== k) : [...e, k]));

  return (
    <div className="scrim" onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        {!out ? (
          <>
            <div className="disp sheettitle">Build me a session</div>
            <p className="meta" style={{ marginBottom: 22 }}>Three answers. That's it.</p>

            <div className="eyebrow qlab">How long have you got?</div>
            <div className="chips">
              {TIMES.map((t) => (
                <button key={t} className={`chip${min === t ? " on" : ""}`} onClick={() => setMin(t)}>{t} min</button>
              ))}
            </div>

            <div className="eyebrow qlab">What have you got?</div>
            <div className="chips">
              {EQUIP.map((e) => (
                <button key={e.k} className={`chip${eq.includes(e.k) || e.k === "none" ? " on" : ""}`}
                  onClick={() => e.k !== "none" && toggle(e.k)} disabled={e.k === "none"}>{e.l}</button>
              ))}
            </div>

            <div className="eyebrow qlab">What are you training?</div>
            <div className="chips">
              {FOCI.map((f) => (
                <button key={f.k} className={`chip${focus === f.k ? " on" : ""}`} onClick={() => setFocus(f.k)}>{f.l}</button>
              ))}
            </div>

            <button className="btn primary" onClick={() => setOut(build(min, eq, focus))}>Generate workout</button>
          </>
        ) : (
          <>
            <span className="tag">{out.cat} · {out.min} min</span>
            <div className="disp sheettitle">{out.t}</div>
            <p className="meta" style={{ marginBottom: 6 }}>{out.ex.length} exercises · {out.eq}</p>
            <div style={{ marginTop: 10 }}>
              {out.ex.map((x, i) => (
                <div className="row" key={`${i}-${x.n}`}>
                  <span className="ix">{String(i + 1).padStart(2, "0")}</span>
                  <div className="rn">{x.n}</div>
                  <span className="rs">{x.s}</span>
                </div>
              ))}
            </div>
            <button className="btn primary" onClick={() => { close(); play(out); }}>Start workout</button>
            {pro ? (
              <button className="btn outline" onClick={() => setOut(build(min, eq, focus))}>Generate another</button>
            ) : (
              <button className="btn outline locked" onClick={() => { close(); upgrade(); }}>
                <svg className="lockico" viewBox="0 0 12 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1.5" y="6" width="9" height="7" rx="1.5" /><path d="M3.6 6V3.9a2.4 2.4 0 014.8 0V6" />
                </svg>
                Generate another — Pro
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────  SKILLS  ───────────────── */

function Skills({ setToast, tier, toMembership, user, progress, addXp }) {
  const [open, setOpen] = useState("muscleup");
  const prog = progress || SEED_PROGRESS;
  const cleared = Object.values(prog).filter((v) => v === "done").length;
  const total = Object.keys(SKILLS).length;

  return (
    <main>
      <div className="rise d1">
        <div className="disp screentitle">Skills</div>
        <p className="meta" style={{ marginBottom: 18 }}>
          {cleared} of {total} unlocked. Each route shows the rungs to the skill at the end of it.
        </p>
      </div>

      {SKILL_LEVELS.map((band, bi) => {
        const routes = CHAINS.filter((c) => c.tier === band);
        if (!routes.length) return null;
        const need = band === "Intermediate" ? "pro" : band === "Advanced" ? "premium" : null;
        const locked = need && !has(tier, need);

        return (
          <div key={band} className={`rise d${Math.min(bi + 2, 5)}`}>
            <Head l={band} r={locked ? planName(need) : `${routes.length} routes`} />

            {locked ? (
              <section className="card gated">
                <div className="branchtop">
                  <div>
                    <div className="dname">{routes.length} {band.toLowerCase()} routes</div>
                    <div className="dreq">{routes.map((r) => r.goal).join(" · ")}</div>
                  </div>
                  <span className="wcat pro">{planName(need)}</span>
                </div>
                <button className="btn outline" onClick={toMembership}>Unlock with {planName(need)}</button>
              </section>
            ) : (
              routes.map((c) => {
                const steps = c.steps.map((st) => stepInfo(st, prog));
                const done = steps.filter((x) => x.s === "done").length;
                const isOpen = open === c.id;
                const owed = missingPre(c.id, prog);

                return (
                  <section key={c.id} className={`card skillcard${isOpen ? " open" : ""}`}>
                    <button className="skillhead" onClick={() => setOpen(isOpen ? null : c.id)} aria-expanded={isOpen}>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span className="skilln">{c.t}</span>
                        <span className="skillpre">
                          {owed.length ? `Needs ${owed.join(", ").toLowerCase()}` : `Goal · ${c.goal}`}
                        </span>
                      </span>
                      <Ring pct={done / steps.length} size={38} w={3.5} label={`${done}/${steps.length}`} />
                      <svg className={`chev${isOpen ? " up" : ""}`} width="11" height="7" viewBox="0 0 11 7" fill="none">
                        <path d="M1 1l4.5 4.5L10 1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      </svg>
                    </button>

                    {isOpen && (
                      <div className="ladder">
                        {steps.map((st, i) => (
                          <div className={`rung ${st.s}`} key={st.key + i}>
                            <span className="rungline" style={i === steps.length - 1 ? { display: "none" } : undefined} />
                            <span className={`rungdot ${st.s}${i === steps.length - 1 ? " goal" : ""}`}>
                              {st.s === "done" && <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.4 2.4L9.5 3.6" stroke="var(--void)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                            </span>
                            <span style={{ minWidth: 0 }}>
                              <span className={`rungtxt${i === steps.length - 1 ? " goalname" : ""}`}>
                                {i === steps.length - 1 ? st.n.toUpperCase() : st.n}
                              </span>
                              {st.req && <span className="rungreq">{st.req}</span>}
                              {st.s === "now" && st.need && (
                                <>
                                  <span className="minibar"><i style={{ width: `${(st.have / st.need) * 100}%` }} /></span>
                                  <span className="rungreq">{st.have} of {st.need}</span>
                                </>
                              )}
                            </span>
                          </div>
                        ))}
                        <div className="btnrow">
                          <button className="btn ghost" onClick={() => { addXp(XP_AWARD.skill); setToast(`Practice logged · +${XP_AWARD.skill} XP`); }}>
                            Log practice
                          </button>
                          <button className="btn ghost" onClick={() => { addXp(XP_AWARD.unlock); setToast(`${c.goal} unlocked · +${XP_AWARD.unlock} XP`); }}>
                            Mark unlocked
                          </button>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })
            )}
          </div>
        );
      })}
    </main>
  );
}

/* ─────────────────  PROGRESS  ───────────────── */

function Progress({ done, vals, retest, sheet, history, saveState, xp, caps }) {
  const [view, setView] = useState(caps.rating ? "rating" : "stats");
  const max = Math.max(...MONTH);
  const totalMin = MONTH.reduce((a, b) => a + b, 0);

  return (
    <main>
      <div className="rise d1">
        <div className="disp screentitle">Progress</div>
        <p className="meta" style={{ marginBottom: 16 }}>
          <span className={`savedot ${saveState}`} />
          {saveState === "saving" ? "Saving…" : saveState === "error" ? "Couldn't save — check your connection" : "Progress saved automatically"}
        </p>
      </div>

      <div className="tiles rise d1">
        <Tile v={history.length} l="Sessions" s="all time" />
        <Tile v="12" l="Day streak" s="best: 19" hot />
        <Tile v={`${Math.round(history.reduce((a, h) => a + (h.min || 0), 0) / 60)}h`} l="Trained" s="all time" />
        <Tile v="6" l="Records" s="4 this month" />
      </div>

      <div className="seg2 four rise d2">
        {caps.rating && <button className={view === "rating" ? "act" : ""} onClick={() => setView("rating")}>Rating</button>}
        <button className={view === "stats" ? "act" : ""} onClick={() => setView("stats")}>Volume</button>
        <button className={view === "prs" ? "act" : ""} onClick={() => setView("prs")}>Records</button>
        <button className={view === "hist" ? "act" : ""} onClick={() => setView("hist")}>History</button>
      </div>

      {view === "rating" && caps.rating && <Rating vals={vals} retest={retest} sheet={sheet} />}

      {view === "stats" && (
        <section className="card rise d3">
          <Head l="Last 31 days" r={`${totalMin} min`} />
          <div className="month">
            {MONTH.map((m, i) => (
              <span key={i} className={`mbar${m ? " on" : ""}`} style={{ height: `${Math.max((m / max) * 100, 6)}%` }} title={`${m} min`} />
            ))}
          </div>
          <div className="barlab" style={{ marginTop: 12 }}>
            <span>4 weeks ago</span><span>Today</span>
          </div>
          <div className="split">
            {[["Pull", 34], ["Push", 26], ["Core", 18], ["Legs", 14], ["Skill", 8]].map(([k, v]) => (
              <div className="srow" key={k}>
                <span className="sk">{k}</span>
                <span className="sbar"><i style={{ width: `${v * 2.6}%` }} /></span>
                <span className="sv">{v}%</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {view === "prs" && (
        <div className="rise d3">
          {PRS.map((p) => (
            <div className="prrow" key={p.n}>
              <div>
                <div className="rn">{p.n}</div>
                <div className="rnote">{p.d}</div>
              </div>
              <div className="prval">
                <b className="disp">{p.v}</b>
                {p.u && <em>{p.u}</em>}
                {p.up && <span className="up">↑</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "hist" && (
        <div className="rise d3">
          {history.length === 0 ? (
            <div className="empty">Nothing logged yet. Finish a workout and it lands here.</div>
          ) : (
            history.map((h) => (
              <div className="prrow" key={h.id}>
                <div>
                  <div className="rn">{h.t}</div>
                  <div className="rnote">{ago(h.at)} · {h.min} min · {h.cat}</div>
                </div>
                <div className="prval"><b className="disp">+{h.xp}</b><em>xp</em></div>
              </div>
            ))
          )}
          <p className="fine" style={{ marginTop: 14 }}>
            {history.length} session{history.length === 1 ? "" : "s"} saved on this device.
          </p>
        </div>
      )}
    </main>
  );
}

function Tile({ v, l, s, hot }) {
  return (
    <div className="tile">
      <b className={`disp${hot ? " hot" : ""}`}>{v}</b>
      <span className="eyebrow">{l}</span>
      <em>{s}</em>
    </div>
  );
}

/* ─────────────────  BODY RATING  ───────────────── */

function Radar({ now, prev }) {
  const CX = 120, CY = 96, R = 68, LR = 88;
  const pt = (i, f) => {
    const a = ((-90 + i * 60) * Math.PI) / 180;
    return [CX + Math.cos(a) * R * f, CY + Math.sin(a) * R * f];
  };
  const poly = (arr) => arr.map((v, i) => pt(i, v / 100).join(",")).join(" ");

  return (
    <svg viewBox="0 0 240 200" className="radar" role="img" aria-label="Strength profile across six areas">
      {[0.25, 0.5, 0.75, 1].map((f) => (
        <polygon key={f} points={poly(TESTS.map(() => f * 100))} fill="none" stroke="#252529" strokeWidth="1" />
      ))}
      {TESTS.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="#252529" strokeWidth="1" />;
      })}
      <polygon points={poly(prev)} fill="none" stroke="#6E6E77" strokeWidth="1.4" strokeDasharray="3 3" opacity=".7" />
      <polygon points={poly(now)} className="glowline" fill="var(--neon)" fillOpacity=".13" stroke="var(--neon)" strokeWidth="2" strokeLinejoin="round" />
      {TESTS.map((t, i) => {
        const a = ((-90 + i * 60) * Math.PI) / 180;
        const x = CX + Math.cos(a) * LR, y = CY + Math.sin(a) * LR;
        const anchor = x > CX + 3 ? "start" : x < CX - 3 ? "end" : "middle";
        return (
          <text key={t.k} x={x} y={y + 4} textAnchor={anchor} className="rlab">{t.l}</text>
        );
      })}
      {TESTS.map((_, i) => {
        const [x, y] = pt(i, now[i] / 100);
        return <circle key={i} cx={x} cy={y} r="3.2" fill="var(--neon)" />;
      })}
    </svg>
  );
}

function Rating({ vals, retest, sheet }) {
  const now = TESTS.map((t) => score(vals[t.k], t.target));
  const prev = TESTS.map((t) => score(t.prev, t.target));
  const overall = Math.round(now.reduce((a, b) => a + b, 0) / now.length);
  const before = Math.round(prev.reduce((a, b) => a + b, 0) / prev.length);
  const tier = tierOf(overall);
  const weakIdx = now.indexOf(Math.min(...now));
  const weak = TESTS[weakIdx];
  const strongIdx = now.indexOf(Math.max(...now));
  const fix = WORKOUTS.find((w) => w.id === weak.w);

  return (
    <div className="rise d3">
      <section className="card">
        <div className="rtop">
          <div>
            <span className="eyebrow">Body rating</span>
            <div className="disp overall">{overall}<em>/100</em></div>
            <div className="tierline">
              <span className="tag">{tier.l}</span>
              <span className="delta">+{overall - before} since last test</span>
            </div>
          </div>
        </div>

        <Radar now={now} prev={prev} />
        <div className="legend">
          <span><i className="sw now" />Today</span>
          <span><i className="sw prev" />8 weeks ago</span>
        </div>

        <p className="pdesc" style={{ marginBottom: 4 }}>{tier.d}</p>
      </section>

      <Head l="By area" r="Score vs. advanced standard" />
      <section className="card">
        {TESTS.map((t, i) => (
          <div className="arearow" key={t.k}>
            <div className="atop">
              <span className="an">
                {t.l}
                {i === weakIdx && <span className="pill">Weakest</span>}
                {i === strongIdx && <span className="pill on">Strongest</span>}
              </span>
              <span className="asc disp">{now[i]}</span>
            </div>
            <div className="bar"><i style={{ width: `${now[i]}%` }} /><u style={{ left: `${prev[i]}%` }} /></div>
            <div className="ameta">
              {t.test} · <b>{vals[t.k]} {t.u}</b> · advanced is {t.target} {t.u}
            </div>
          </div>
        ))}
      </section>

      <Head l="Your weakest link" />
      <section className="card lit">
        <div className="dname">{weak.l} is holding the score down</div>
        <p className="pdesc">
          It's {now[strongIdx] - now[weakIdx]} points behind your {TESTS[strongIdx].l.toLowerCase()}. Imbalances this
          size are what stall skill work later — the front lever needs core, not more pulling.
        </p>
        {fix && <button className="btn outline" onClick={() => sheet(fix)}>Open {fix.t.toLowerCase()}</button>}
      </section>

      <button className="btn primary" style={{ marginBottom: 10 }} onClick={retest}>Retake assessment</button>
      <p className="fine">Six timed tests, about 20 minutes. Retest every 6–8 weeks.</p>
    </div>
  );
}

function Assess({ vals, close, save }) {
  const [i, setI] = useState(0);
  const [v, setV] = useState({ ...vals });
  const [reveal, setReveal] = useState(false);
  const t = TESTS[i];
  const cur = v[t.k];

  const now = TESTS.map((x) => score(v[x.k], x.target));
  const overall = Math.round(now.reduce((a, b) => a + b, 0) / now.length);

  const bump = (n) => setV((s) => ({ ...s, [t.k]: Math.max(0, s[t.k] + n) }));

  if (reveal) {
    const tier = tierOf(overall);
    return (
      <div className="player">
        <div className="phead">
          <span style={{ width: 32 }} />
          <div className="eyebrow">Your result</div>
          <span style={{ width: 32 }} />
        </div>
        <div className="pbody">
          <div className="disp overall big">{overall}<em>/100</em></div>
          <span className="tag" style={{ marginBottom: 18 }}>{tier.l}</span>
          <Radar now={now} prev={TESTS.map((x) => score(x.prev, x.target))} />
          <p className="cue" style={{ marginTop: 10 }}>{tier.d}</p>
          <button className="btn primary" style={{ marginTop: 24 }} onClick={() => save(v)}>Save rating</button>
          <button className="peek" onClick={() => { setReveal(false); setI(0); }}>Go back and adjust</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="pbar"><i style={{ width: `${((i + 1) / TESTS.length) * 100}%` }} /></div>
      <div className="phead">
        <button className="close" onClick={close} aria-label="Cancel assessment">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        <div className="eyebrow">Assessment</div>
        <div className="eyebrow">{i + 1} / {TESTS.length}</div>
      </div>

      <div className="pbody">
        <div className="eyebrow">{t.l}</div>
        <h2 className="disp exname" style={{ fontSize: 30 }}>{t.test}</h2>
        <p className="cue" style={{ marginTop: 0, marginBottom: 26 }}>{t.cue}</p>

        <div className="stepper">
          <button onClick={() => bump(-t.big)} aria-label={`minus ${t.big}`}>−{t.big}</button>
          <div className="sval">
            <b className="disp">{cur}</b>
            <em>{t.u}</em>
          </div>
          <button onClick={() => bump(t.big)} aria-label={`plus ${t.big}`}>+{t.big}</button>
        </div>
        <div className="btnrow" style={{ maxWidth: 220, width: "100%" }}>
          <button className="btn ghost" onClick={() => bump(-1)}>−1</button>
          <button className="btn ghost" onClick={() => bump(1)}>+1</button>
        </div>

        <div className="scorepeek">
          <span className="eyebrow">Scores</span>
          <b className="disp">{score(cur, t.target)}</b>
          <em>last test: {t.prev} {t.u}</em>
        </div>

        <button
          className="btn primary"
          style={{ marginTop: 22, maxWidth: 320 }}
          onClick={() => (i < TESTS.length - 1 ? setI(i + 1) : setReveal(true))}
        >
          {i < TESTS.length - 1 ? "Next test" : "See my rating"}
        </button>
        {i > 0 && <button className="peek" onClick={() => setI(i - 1)}>Previous</button>}
      </div>

      <div className="upnext">
        {TESTS.map((x, k) => (
          <span key={x.k} className={`unode${k < i ? " done" : k === i ? " now" : ""}`} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────  YOU  ───────────────── */

const THEMES = [["limeneon", "Neon lime"], ["lime", "Acid lime"], ["neon", "Neon white"]];

function You({ xp, setToast, vals, retest, theme, setTheme, user, signOut, tier, upgrade, reset, openMusic, openGame, best, setWhy, caps, setLevel }) {
  const [confirmReset, setConfirmReset] = useState(false);
  const [goal, setGoal] = useState("Muscle-up");
  const goals = ["Muscle-up", "Handstand", "Front lever", "General strength"];
  const lvl = Math.floor(xp / 700);
  const scores = TESTS.map((t) => score(vals[t.k], t.target));
  const overall = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);

  return (
    <main>
      <section className="profile rise d1">
        <div className="avbig">{initials(user.name)}</div>
        <div style={{ minWidth: 0 }}>
          <div className="disp screentitle" style={{ marginBottom: 4 }}>{user.name}</div>
          <div className="meta">{user.lvl} · {(Array.isArray(user.goal) ? user.goal : [user.goal]).join(" · ")}</div>
          {user.why && <div className="whyline">“{user.why}”</div>}
          {tier === "life" && (
            <span className="founder">
              <Mark size={11} /> Founder
            </span>
          )}
        </div>
      </section>


      {caps.rating && <button className="ratestrip rise d1" onClick={retest}>
        <div>
          <span className="eyebrow">Body rating</span>
          <div className="disp overall sm">{overall}<em>/100 · {tierOf(overall).l}</em></div>
        </div>
        <span className="wcat">Retest</span>
      </button>}

      <div className="tiles rise d1">
        <Tile v={lvl} l="Level" s={`${xp} XP`} hot />
        <Tile v="0" l="Programs" s="completed" />
        <Tile v="0" l="Total reps" s="all time" />
        <Tile v={BADGES.filter((b) => b.got).length} l="Badges" s={`of ${BADGES.length}`} />
      </div>

      <div className="rise d2"><Head l="Accent" r="Changes the whole app" /></div>
      <div className="chips rise d2" style={{ marginBottom: 22 }}>
        {THEMES.map(([k, l]) => (
          <button key={k} className={`chip${theme === k ? " on" : ""}`} onClick={() => setTheme(k)}>
            <span className="swatch" data-t={k} />{l}
          </button>
        ))}
      </div>

      <div className="rise d2"><Head l="Your level" r="Sets your workouts" /></div>
      <div className="chips rise d2" style={{ marginBottom: 8 }}>
        {["Beginner", "Intermediate", "Advanced"].map((k) => (
          <button key={k} className={`chip${user.lvl === k ? " on" : ""}`}
            onClick={() => { setLevel(k); setToast(`Level set to ${k.toLowerCase()}`); }}>{k}</button>
        ))}
      </div>
      <p className="fine rise d2" style={{ textAlign: "left", marginBottom: 22 }}>
        Changes the sessions you're shown and how much volume the split gives you. Nothing you've logged is lost.
      </p>

      <div className="rise d2"><Head l="Why you train" r="Set at sign-up" /></div>
      <div className="chips rise d2" style={{ marginBottom: 22 }}>
        {PURPOSES.map(([k]) => (
          <button
            key={k}
            className={`chip sm${user.why === k ? " on" : ""}`}
            onClick={() => { setWhy(k); setToast(`Updated · ${k.toLowerCase()}`); }}
          >
            {k}
          </button>
        ))}
      </div>

      <div className="rise d2"><Head l="Primary goal" r="Drives your plan" /></div>
      <div className="chips rise d2" style={{ marginBottom: 22 }}>
        {goals.map((g) => (
          <button key={g} className={`chip${goal === g ? " on" : ""}`} onClick={() => { setGoal(g); setToast(`Goal set · ${g}`); }}>{g}</button>
        ))}
      </div>

      <div className="rise d3"><Head l="Achievements" r={`${BADGES.filter((b) => b.got).length} of ${BADGES.length}`} /></div>
      <div className="badges rise d3">
        {BADGES.map((b) => (
          <div key={b.n} className={`badge${b.got ? " got" : ""}`}>
            <div className="bdot" />
            <div className="bn">{b.n}</div>
            <div className="bd">{b.d}</div>
          </div>
        ))}
      </div>

      <section className="card pro rise d4">
        {tier !== "free" ? (
          <>
            <span className="tag">{planName(tier)} active</span>
            <div className="disp herotitle">
              {tier === "life" ? <>Yours<br />forever</> : <>Everything<br />unlocked</>}
            </div>
            <ul className="prolist">{(PLANS.find((x) => x.k === tier) || PLANS[0]).perks.map((x) => <li key={x}>{x}</li>)}</ul>
            {tier === "pro" && (
              <button className="btn primary" onClick={upgrade}>Move up to Premium — €9.99</button>
            )}
            <a className="btn outline" href={CREATOR.links[0].u} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              Follow @{CREATOR.handle}
            </a>
          </>
        ) : (
          <>
            <span className="tag">Skilxz Pro</span>
            <div className="disp herotitle">Unlock<br />everything</div>
            <ul className="prolist">{PLANS[0].perks.slice(0, 4).map((x) => <li key={x}>{x}</li>)}</ul>
            <button className="btn primary" onClick={upgrade}>See plans — from €3.99</button>
            <p className="fine" style={{ marginTop: 10 }}>Three programmes and the 6-day split stay free forever.</p>
          </>
        )}
      </section>

      <div className="rise d4"><Head l="Rep Rush" r={`Best ${best}`} /></div>
      <button className="wcard rise d4" onClick={openGame}>
        <div>
          <div className="wtitle">Play Rep Rush</div>
          <div className="wmeta">Timing game for rest days and dead signal. Works offline.</div>
        </div>
        <span className="wcat">Play</span>
      </button>

      <div className="rise d4"><Head l="Bar Work" r="Plays with no connection" /></div>
      <button className="wcard rise d4" onClick={openGame}>
        <div>
          <div className="wtitle">Rest-day game</div>
          <div className="wmeta">Time the grip zone. Best so far: {best} reps</div>
        </div>
        <span className="wcat">Play</span>
      </button>

      <div className="rise d4"><Head l="Music" r="Plays through your session" /></div>
      <button className="wcard rise d4" onClick={openMusic}>
        <div>
          <div className="wtitle">Your tracks</div>
          <div className="wmeta">Load your own audio, or start a playlist in your streaming app</div>
        </div>
        <span className="wcat">Open</span>
      </button>

      <div className="rise d4"><Head l="Membership" r="Everything you buy lives here" /></div>
      <section className="card rise d4">
        <div className="ptop">
          <div style={{ minWidth: 0 }}>
            <div className="dname">{tier === "free" ? "Free plan" : `${planName(tier)} plan`}</div>
            <div className="dreq">
              {tier === "free"
                ? "The 6-day split, 3 programmes and tracking"
                : tier === "life" ? "One payment, no renewal" : "Renews monthly through your store account"}
            </div>
          </div>
          <span className={`wcat${tier !== "free" ? " pro" : ""}`}>{tier === "free" ? "Free" : "Active"}</span>
        </div>

        <button className="btn primary" onClick={upgrade}>
          {tier === "free" ? "See plans — from €3.99" : tier === "life" ? "View what's included" : "Change plan"}
        </button>
        <button className="btn outline" onClick={() => setToast("Checking your store account for previous purchases…")}>
          Restore purchases
        </button>
        {tier !== "free" && tier !== "life" && (
          <button className="peek" onClick={() => setToast("Manage or cancel in your App Store or Google Play account")}>
            Manage or cancel subscription
          </button>
        )}
        <p className="fine" style={{ marginTop: 12, textAlign: "left" }}>
          Every purchase in Skilxz happens here. Nothing charges you from inside a workout, and there are no
          one-off unlocks scattered through the app.
        </p>
      </section>

      <div className="rise d5"><Head l="Creator" r="Follow along" /></div>
      <section className="card rise d5">
        <div className="dname">Trained by {CREATOR.handle}</div>
        <p className="pdesc">Every demo clip and programme in Skilxz is filmed and coached by me.</p>
        <div className="social">
          {CREATOR.links.map((l) => (
            <a key={l.p} className="soc" href={l.u} target="_blank" rel="noopener noreferrer">
              <span className="socp">{l.p}</span>
              <span className="soch">{l.h}</span>
            </a>
          ))}
        </div>
      </section>

      {(user.age ?? 30) >= 18 && (
        <>
          <div className="rise d5"><Head l="Also by me" r="Opens in a new tab" /></div>
          <section className="card creavoa rise d5">
            <span className="tag">{CREAVOA.tag}</span>
            <div className="disp herotitle">{CREAVOA.n}</div>
            <p className="pdesc">{CREAVOA.d}</p>

            <div className="ctools">
              {CREAVOA.tools.map(([n, d]) => (
                <div className="ctool" key={n}>
                  <span className="ctn">{n}</span>
                  <span className="ctd">{d}</span>
                </div>
              ))}
            </div>
            <p className="fine" style={{ textAlign: "left", margin: "12px 0 0" }}>
              {CREAVOA.count} tools in total. Free to start.
            </p>

            <a className="btn primary" href={CREAVOA.join} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              Get started free
            </a>
            <div className="btnrow">
              <a className="btn ghost" href={CREAVOA.dash} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>Dashboard</a>
              <a className="btn ghost" href={CREAVOA.price} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>Pricing</a>
            </div>
          </section>
        </>
      )}

      <div className="rise d5" style={{ marginTop: 22 }}><Head l="Account" r={user.email} /></div>
      <button className="btn outline" style={{ marginTop: 0 }} onClick={signOut}>Sign out</button>
      <button className="btn outline danger" onClick={() => { if (confirmReset) reset(); else setConfirmReset(true); }}>
        {confirmReset ? "Tap again to erase everything" : "Reset all progress"}
      </button>
      <p className="fine" style={{ marginTop: 12 }}>Your workouts, records, skill progress and settings are saved on this device and restored next time you open the app.</p>
    </main>
  );
}

/* ─────────────────  FUEL DATA  ───────────────── */

const TARGET = { kcal: [2400, 2700], p: [115, 155], c: [280, 340], f: [70, 95] };

const DEMO_SCANS = [
  {
    label: "Chicken, rice and broccoli",
    items: [
      { n: "Chicken breast", q: "~180 g", k: [280, 320], p: 55, c: 0, f: 7, conf: 92 },
      { n: "White rice", q: "~1 cup cooked", k: [190, 230], p: 4, c: 45, f: 1, conf: 88 },
      { n: "Broccoli", q: "~120 g", k: [40, 60], p: 4, c: 8, f: 1, conf: 81 },
      { n: "Oil or sauce", q: "hard to see", k: [40, 140], p: 0, c: 2, f: 12, conf: 34 },
    ],
  },
  {
    label: "Oats, banana and peanut butter",
    items: [
      { n: "Rolled oats", q: "~80 g dry", k: [290, 320], p: 11, c: 54, f: 6, conf: 90 },
      { n: "Banana", q: "1 medium", k: [90, 120], p: 1, c: 27, f: 0, conf: 95 },
      { n: "Peanut butter", q: "~1.5 tbsp", k: [140, 200], p: 7, c: 6, f: 16, conf: 62 },
      { n: "Milk", q: "~200 ml", k: [90, 130], p: 7, c: 10, f: 4, conf: 71 },
    ],
  },
  {
    label: "Eggs, sourdough and avocado",
    items: [
      { n: "Eggs", q: "3 large", k: [210, 240], p: 19, c: 1, f: 16, conf: 94 },
      { n: "Sourdough", q: "2 slices", k: [160, 220], p: 8, c: 38, f: 1, conf: 86 },
      { n: "Avocado", q: "~half", k: [110, 170], p: 2, c: 6, f: 15, conf: 78 },
      { n: "Butter or oil", q: "hard to see", k: [30, 110], p: 0, c: 0, f: 10, conf: 29 },
    ],
  },
  {
    label: "Salmon, potatoes and salad",
    items: [
      { n: "Salmon fillet", q: "~150 g", k: [280, 330], p: 34, c: 0, f: 18, conf: 89 },
      { n: "Roast potatoes", q: "~200 g", k: [220, 300], p: 5, c: 42, f: 7, conf: 74 },
      { n: "Mixed salad", q: "~1 bowl", k: [30, 50], p: 2, c: 6, f: 0, conf: 83 },
      { n: "Dressing", q: "hard to see", k: [50, 160], p: 0, c: 3, f: 14, conf: 31 },
    ],
  },
];

const START_MEALS = [
  { id: 1, n: "Oats, banana, peanut butter", t: "07:20", k: [610, 770], p: 26 },
  { id: 2, n: "Chicken wrap and yoghurt", t: "12:45", k: [640, 780], p: 48 },
  { id: 3, n: "Rice cakes and honey", t: "16:10", k: [180, 230], p: 3 },
];

const EAT = {
  training: {
    h: "On a training day",
    p: "Skill work needs a working nervous system, not a full stomach. The pattern that works for most people is a carb-led meal two to three hours out, then something small and easy if you're still hungry closer to the session.",
    pts: [
      "Eat the bigger carb meal 2–3 hours before you train",
      "Keep the pre-session snack low in fat and fibre — it clears the stomach faster",
      "Protein at every meal matters more than protein straight after training",
      "Drink to thirst; grip fails early when you're dehydrated",
    ],
    ideas: [
      { n: "Oats, milk, banana, honey", w: "3h before", why: "Slow carbs that don't sit heavy" },
      { n: "Rice, eggs, soy sauce", w: "2h before", why: "Cheap, fast, easy to digest" },
      { n: "Toast with jam and a coffee", w: "45m before", why: "Quick carbs, almost no fat" },
      { n: "Greek yoghurt, berries, granola", w: "after", why: "Protein and carbs in one bowl" },
    ],
  },
  rest: {
    h: "On a rest day",
    p: "Rest days are when the adaptation actually happens. Appetite usually drops, and eating noticeably less on those days is the most common reason people stall on a strength block.",
    pts: [
      "Keep protein the same as a training day — this is when tissue is rebuilt",
      "Carbs can come down a little if you're genuinely less hungry",
      "Don't 'earn back' food you think you didn't burn",
      "A rest day you under-eat is a training day you'll underperform",
    ],
    ideas: [
      { n: "Eggs, sourdough, avocado", w: "breakfast", why: "Protein and fat keep you full" },
      { n: "Lentil soup and bread", w: "lunch", why: "Fibre, protein, easy to batch" },
      { n: "Salmon, potatoes, salad", w: "dinner", why: "Protein with real volume" },
      { n: "Cottage cheese and fruit", w: "evening", why: "Slow protein before sleep" },
    ],
  },
  basics: {
    h: "The parts that matter",
    p: "Most of the result comes from four habits. Everything past these is a rounding error, and chasing the rounding error is how people end up miserable about food.",
    pts: [
      "Enough total food to support the training you're doing",
      "Protein at roughly 1.6–2.2 g per kg of bodyweight, spread across the day",
      "Mostly whole foods, because they're more filling per calorie",
      "Consistency across weeks beats precision on any single day",
    ],
    ideas: [
      { n: "Chicken, beans, eggs, yoghurt", w: "protein", why: "Cheap and easy to hit targets with" },
      { n: "Rice, oats, potatoes, bread", w: "carbs", why: "Fuel for the hard sets" },
      { n: "Olive oil, nuts, avocado, fish", w: "fats", why: "Hormones and joints" },
      { n: "Anything green, twice a day", w: "the rest", why: "Fibre and micronutrients" },
    ],
  },
};

/* ─────────────────  FUEL SCREEN  ───────────────── */

function Fuel({ meals, addMeal, delMeal, numbers, setNumbers, setToast }) {
  const [scan, setScan] = useState(false);
  const [tab, setTab] = useState("training");
  const g = EAT[tab];

  const lo = meals.reduce((a, m) => a + m.k[0], 0);
  const hi = meals.reduce((a, m) => a + m.k[1], 0);
  const pro = meals.reduce((a, m) => a + m.p, 0);
  const mid = Math.round((lo + hi) / 2);
  const pct = Math.min(mid / TARGET.kcal[1], 1);

  return (
    <main>
      <div className="rise d1">
        <div className="disp screentitle">Fuel</div>
        <p className="meta" style={{ marginBottom: 18 }}>
          What to eat around your training, and a rough count if you want one.
        </p>
      </div>

      <section className="card rise d1">
        <div className="herotop">
          <div>
            <span className="eyebrow">Today</span>
            {numbers ? (
              <>
                <div className="disp kcal">{lo.toLocaleString()}–{hi.toLocaleString()}<em>kcal</em></div>
                <p className="meta">Target {TARGET.kcal[0].toLocaleString()}–{TARGET.kcal[1].toLocaleString()} on a training day</p>
              </>
            ) : (
              <>
                <div className="disp kcal sm">{meals.length} meals<em>logged</em></div>
                <p className="meta">Protein in {meals.filter((m) => m.p >= 20).length} of them</p>
              </>
            )}
          </div>
          {numbers && <Ring pct={pct} label={`${Math.round(pct * 100)}%`} sub="of target" />}
        </div>

        {numbers && (
          <div className="split" style={{ marginTop: 18 }}>
            <div className="srow">
              <span className="sk">Protein</span>
              <span className="sbar"><i style={{ width: `${Math.min((pro / TARGET.p[1]) * 100, 100)}%` }} /></span>
              <span className="sv">{pro}g</span>
            </div>
            <p className="fine" style={{ textAlign: "left", margin: "4px 0 0" }}>
              Aim for {TARGET.p[0]}–{TARGET.p[1]}g across the day. It's the one number worth watching.
            </p>
          </div>
        )}

        <button className="peek" onClick={() => setNumbers(!numbers)}>
          {numbers ? "Hide the numbers" : "Show the numbers"}
        </button>
      </section>

      <button className="gencard rise d2" onClick={() => setScan(true)}>
        <div>
          <span className="tag">Camera</span>
          <div className="disp gentitle">Scan a<br />meal</div>
          <p className="meta" style={{ marginTop: 8 }}>Point at your plate. You'll get an estimate, not a verdict.</p>
        </div>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <circle cx="12" cy="12.5" r="3.6" />
        </svg>
      </button>

      <div className="rise d3"><Head l="Logged today" r={`${meals.length} meals`} /></div>
      <section className="card rise d3">
        {meals.length === 0 ? (
          <div className="empty" style={{ border: "none", padding: "10px 0" }}>Nothing logged yet. Scan a plate or add one by hand.</div>
        ) : (
          meals.map((m) => (
            <div className="prrow" key={m.id}>
              <div>
                <div className="rn">{m.n}</div>
                <div className="rnote">{m.t}{numbers ? ` · ~${m.p}g protein` : ""}</div>
              </div>
              <div className="prval">
                {numbers && <b className="disp" style={{ fontSize: 16 }}>{m.k[0]}–{m.k[1]}</b>}
                <button className="xbtn" onClick={() => delMeal(m.id)} aria-label={`Remove ${m.n}`}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      <div className="rise d4"><Head l="What to eat" /></div>
      <div className="seg2 rise d4">
        <button className={tab === "training" ? "act" : ""} onClick={() => setTab("training")}>Training day</button>
        <button className={tab === "rest" ? "act" : ""} onClick={() => setTab("rest")}>Rest day</button>
        <button className={tab === "basics" ? "act" : ""} onClick={() => setTab("basics")}>Basics</button>
      </div>

      <section className="card rise d5">
        <div className="dname">{g.h}</div>
        <p className="pdesc">{g.p}</p>
        <ul className="prolist">{g.pts.map((x) => <li key={x}>{x}</li>)}</ul>
      </section>

      <div className="rise d5"><Head l="Meal ideas" r={g.h.replace("On a ", "").replace("The parts that matter", "By role")} /></div>
      <div className="rise d5">
        {g.ideas.map((m) => (
          <div className="wcard" key={m.n} style={{ cursor: "default" }}>
            <div>
              <div className="wtitle">{m.n}</div>
              <div className="wmeta">{m.why}</div>
            </div>
            <span className="wcat">{m.w}</span>
          </div>
        ))}
      </div>

      <div className="rise d5"><Head l="Meal plans" r="Macros per serving" /></div>
      <MealPlans />

      <p className="fine" style={{ marginTop: 14 }}>
        General guidance for healthy adults, not medical or dietary advice. If you're under 18, pregnant, managing a
        health condition, or have a history of disordered eating, talk to a professional before tracking intake.
      </p>

      {scan && <Scanner close={() => setScan(false)} add={(m) => { addMeal(m); setScan(false); setToast("Meal added to today"); }} />}
    </main>
  );
}

function MealPlans() {
  const [tag, setTag] = useState("All");
  const list = MEALPLAN.filter((m) => tag === "All" || m.tag === tag);
  return (
    <div className="rise d5">
      <div className="chips" style={{ marginBottom: 12 }}>
        {MEALTAGS.map((t) => (
          <button key={t} className={`chip sm${tag === t ? " on" : ""}`} onClick={() => setTag(t)}>{t}</button>
        ))}
      </div>
      {list.map((m) => (
        <div className="card meal" key={m.n}>
          <div className="mtop">
            <div style={{ minWidth: 0 }}>
              <div className="wtitle">{m.n}</div>
              <div className="wmeta">{m.d}</div>
            </div>
            <span className="wcat">{m.tag}</span>
          </div>
          <div className="macros">
            <span className="macro"><b className="disp">{m.k}</b><em>kcal</em></span>
            <span className="macro"><b className="disp">{m.p}g</b><em>protein</em></span>
            <span className="macro"><b className="disp">{m.c}g</b><em>carbs</em></span>
            <span className="macro"><b className="disp">{m.f}g</b><em>fat</em></span>
          </div>
          <div className="mbars">
            <i className="p" style={{ flex: m.p * 4 }} />
            <i className="c" style={{ flex: m.c * 4 }} />
            <i className="f" style={{ flex: m.f * 9 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────  CAMERA SCANNER  ───────────────── */

function Scanner({ close, add }) {
  const [phase, setPhase] = useState("aim");
  const [live, setLive] = useState(false);
  const [result, setResult] = useState(null);
  const [mult, setMult] = useState(1);
  const [drop, setDrop] = useState([]);
  const vid = useRef(null);
  const stream = useRef(null);

  useEffect(() => {
    let dead = false;
    (async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (dead) { s.getTracks().forEach((t) => t.stop()); return; }
        stream.current = s;
        if (vid.current) vid.current.srcObject = s;
        setLive(true);
      } catch {
        setLive(false);
      }
    })();
    return () => {
      dead = true;
      if (stream.current) stream.current.getTracks().forEach((t) => t.stop());
    };
  }, []);

  const capture = () => {
    setPhase("reading");
    setTimeout(() => {
      setResult(DEMO_SCANS[Math.floor(Math.random() * DEMO_SCANS.length)]);
      setPhase("result");
    }, 1700);
  };

  const kept = result ? result.items.filter((_, i) => !drop.includes(i)) : [];
  const lo = Math.round(kept.reduce((a, x) => a + x.k[0], 0) * mult);
  const hi = Math.round(kept.reduce((a, x) => a + x.k[1], 0) * mult);
  const pro = Math.round(kept.reduce((a, x) => a + x.p, 0) * mult);

  if (phase === "result") {
    return (
      <div className="player">
        <div className="phead">
          <button className="close" onClick={close} aria-label="Close"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg></button>
          <div className="eyebrow">Estimate</div>
          <span style={{ width: 32 }} />
        </div>
        <div className="pbody" style={{ justifyContent: "flex-start", paddingTop: 4 }}>
          <div className="eyebrow">Looks like</div>
          <h2 className="disp exname" style={{ fontSize: 26, marginBottom: 14 }}>{result.label}</h2>
          <div className="disp kcal big">{lo}–{hi}<em>kcal</em></div>
          <p className="fine" style={{ maxWidth: 300 }}>
            A photo can't see oil, sauce or what's underneath. Treat this as a range, and correct anything wrong below.
          </p>

          <div className="scanlist">
            {result.items.map((x, i) => {
              const off = drop.includes(i);
              return (
                <div className={`scanrow${off ? " off" : ""}`} key={x.n}>
                  <button className="tickbox" onClick={() => setDrop((d) => (off ? d.filter((k) => k !== i) : [...d, i]))} aria-label={off ? `Include ${x.n}` : `Remove ${x.n}`}>
                    {!off && <svg viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.4 2.4L9.5 3.6" stroke="#000000" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                  <div style={{ flex: 1 }}>
                    <div className="rn">{x.n}</div>
                    <div className="rnote">{x.q} · {Math.round(x.k[0] * mult)}–{Math.round(x.k[1] * mult)} kcal</div>
                  </div>
                  <span className={`conf${x.conf < 50 ? " low" : ""}`}>{x.conf}%</span>
                </div>
              );
            })}
          </div>

          <div className="eyebrow" style={{ marginTop: 20, marginBottom: 9 }}>Portion</div>
          <div className="chips" style={{ justifyContent: "center" }}>
            {[0.5, 1, 1.5, 2].map((m) => (
              <button key={m} className={`chip${mult === m ? " on" : ""}`} onClick={() => setMult(m)}>{m}×</button>
            ))}
          </div>

          <button className="btn primary" style={{ maxWidth: 320, marginTop: 18 }}
            onClick={() => add({ id: Date.now(), n: result.label, t: "just now", k: [lo, hi], p: pro })}>
            Add to today
          </button>
          <button className="peek" onClick={() => { setPhase("aim"); setResult(null); setDrop([]); setMult(1); }}>Scan again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="player">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close camera"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg></button>
        <div className="eyebrow">Scan a meal</div>
        <span style={{ width: 32 }} />
      </div>

      <div className="pbody" style={{ justifyContent: "center" }}>
        <div className={`finder${phase === "reading" ? " reading" : ""}`}>
          {live ? (
            <video ref={vid} autoPlay playsInline muted className="feed" />
          ) : (
            <div className="nofeed">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8a2 2 0 012-2h2l1.5-2h7L17 6h2a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><circle cx="12" cy="12.5" r="3.6" />
              </svg>
              <span className="eyebrow">Camera unavailable — demo scan</span>
            </div>
          )}
          <span className="corner tl" /><span className="corner tr" /><span className="corner bl" /><span className="corner br" />
          {phase === "reading" && <span className="scanline" />}
        </div>

        {phase === "reading" ? (
          <>
            <div className="eyebrow" style={{ marginTop: 22 }}>Reading the plate</div>
            <p className="cue">Matching what it can see against a food database.</p>
          </>
        ) : (
          <>
            <p className="cue" style={{ marginTop: 20 }}>
              Get the whole plate in frame, from above. Something for scale — a fork, your hand — makes portions far more accurate.
            </p>
            <button className="shutter" onClick={capture} aria-label="Capture" />
            <span className="eyebrow">Tap to capture</span>
          </>
        )}
      </div>
    </div>
  );
}

/* ─────────────────  EXERCISE LIBRARY  ─────────────────
   Real coaching content: setup, ordered steps, breathing, tempo,
   the mistakes that actually cost people progress, and the rung
   below and above each movement. */

const M_FRONT = {
  shoulders: ["M22 40a7 7 0 0111 2l-3 8-9-4z", "M58 40a7 7 0 00-11 2l3 8 9-4z"],
  chest: ["M28 46h12v11c0 2-2 3-6 3s-6-1-6-3z", "M40 46h12v11c0 2-2 3-6 3s-6-1-6-3z"],
  biceps: ["M19 52l6 2-2 14-6-2z", "M61 52l-6 2 2 14 6-2z"],
  forearms: ["M17 68l6 2-2 12-6-2z", "M63 68l-6 2 2 12 6-2z"],
  abs: ["M31 62h18v20c0 3-3 5-9 5s-9-2-9-5z"],
  obliques: ["M28 62h3v22h-3z", "M49 62h3v22h-3z"],
  quads: ["M31 89h8v26h-8z", "M41 89h8v26h-8z"],
  calves: ["M32 118h6v16h-6z", "M42 118h6v16h-6z"],
};
const M_BACK = {
  traps: ["M28 38h24l-4 12H32z"],
  lats: ["M25 50h13v22l-13-8z", "M42 50h13v20l-13 10z"],
  triceps: ["M19 52l6 2-2 14-6-2z", "M61 52l-6 2 2 14 6-2z"],
  lowerback: ["M32 74h16v10H32z"],
  glutes: ["M30 84h10v12H30z", "M40 84h10v12H40z"],
  hams: ["M31 98h8v18h-8z", "M41 98h8v18h-8z"],
  calves: ["M32 118h6v16h-6z", "M42 118h6v16h-6z"],
};
const MNAMES = {
  lats: "Lats", biceps: "Biceps", traps: "Traps", chest: "Chest", triceps: "Triceps",
  shoulders: "Shoulders", abs: "Abs", obliques: "Obliques", quads: "Quads",
  glutes: "Glutes", hams: "Hamstrings", calves: "Calves", forearms: "Forearms", lowerback: "Lower back",
};

const LIB = [
  {
    n: "Pull-up", cat: "Pull", lvl: "Intermediate", eq: "Pull-up bar",
    blurb: "The benchmark upper-body pull. Everything on the muscle-up path runs through it.",
    prim: ["lats", "biceps"], sec: ["traps", "abs", "forearms"],
    setup: "Grip the bar a little wider than your shoulders, palms facing away. Hang with straight arms, ankles crossed, shoulders pulled down away from your ears.",
    steps: [
      "Set the shoulders first. Without bending your arms at all, pull your shoulder blades down and together, and hold that for the whole rep.",
      "Drive your elbows down toward your hips. Think about pulling the bar to you rather than pulling yourself to the bar.",
      "Stay slightly hollow — ribs down, glutes squeezed, legs just in front of you. No swinging.",
      "Pull until your chin clears the bar cleanly. If it stalls halfway, that was the rep. Don't crane your neck over.",
      "Lower under control for 2 to 3 seconds until your arms are completely straight.",
    ],
    breath: "In at the bottom, out as you pull.",
    tempo: "1 second up, 2–3 seconds down.",
    mistakes: [
      { m: "Kipping or swinging up", f: "Cross your ankles and squeeze your glutes. If you still swing, the set is over." },
      { m: "Not straightening at the bottom", f: "Full dead hang every rep. Half reps build a half range and stall you for months." },
      { m: "Shrugging into your ears", f: "Set the shoulder blades down before the arms bend." },
    ],
    easier: "Australian row", harder: "Chest-to-bar",
    rx: "3–5 sets of 3–8 strict reps, 2–3 min rest.",
  },
  {
    n: "Push-up", cat: "Push", lvl: "Beginner", eq: "None",
    blurb: "A moving plank. Done properly it trains your core as hard as your chest.",
    prim: ["chest", "triceps"], sec: ["shoulders", "abs"],
    setup: "Hands just outside shoulder width, fingers spread and pointing forward. Body in one line from heels to head. Squeeze your glutes before you move.",
    steps: [
      "Screw your hands into the floor as if turning two jars outward. This locks the shoulders into a safe position.",
      "Lower with your elbows at roughly 45 degrees to your body, not flared out to the sides.",
      "Go down until your chest is about a fist's height from the floor.",
      "Push the floor away and keep pushing until your elbows lock and your upper back spreads.",
      "Hips move at the same speed as your shoulders — the whole body arrives together.",
    ],
    breath: "In on the way down, out as you press.",
    tempo: "2 seconds down, 1 up.",
    mistakes: [
      { m: "Hips sagging or piking up", f: "Squeeze the glutes and brace as if about to be punched in the stomach." },
      { m: "Elbows flared out to 90 degrees", f: "Tuck to 45. It's kinder to the shoulder and it's stronger." },
      { m: "Head reaching for the floor first", f: "Neck stays neutral — eyes on a spot slightly ahead of your hands." },
    ],
    easier: "Incline push-up", harder: "Diamond push-up",
    rx: "3–4 sets of 8–20 reps, 90 sec rest.",
  },
  {
    n: "Dip", cat: "Push", lvl: "Intermediate", eq: "Parallel bars",
    blurb: "The strongest bodyweight press you can train, and the top half of a muscle-up.",
    prim: ["chest", "triceps"], sec: ["shoulders"],
    setup: "Support yourself on straight arms, shoulders pressed down, chest tall, legs together and slightly in front.",
    steps: [
      "Start from a solid support hold — shoulders down, elbows locked, body still.",
      "Lean your torso forward slightly and lower by bending the elbows, keeping them close to your ribs.",
      "Descend until your shoulders are level with, or just below, your elbows.",
      "Press back up driving through the heel of your hand, and finish with a full lockout.",
      "Don't let your shoulders roll forward at the bottom — that's the position that injures people.",
    ],
    breath: "In on the descent, out on the press.",
    tempo: "2 seconds down, 1 up. Never bounce out of the bottom.",
    mistakes: [
      { m: "Going too deep too early", f: "Build depth over weeks. Stop where you can still control the return." },
      { m: "Shoulders rolling forward", f: "Chest proud, shoulder blades pulled down throughout." },
      { m: "Swinging the legs for momentum", f: "Hold the legs still and slightly forward. Let the arms do the work." },
    ],
    easier: "Bench dip", harder: "Ring dip",
    rx: "3–4 sets of 5–12 reps, 2 min rest.",
  },
  {
    n: "Australian row", cat: "Pull", lvl: "Beginner", eq: "Low bar",
    blurb: "The best entry point to pulling. Change your foot position and it scales from very easy to very hard.",
    prim: ["lats", "biceps"], sec: ["traps", "abs"],
    setup: "Set a bar around hip height. Hang underneath it with straight arms, body in one line, heels on the floor.",
    steps: [
      "Squeeze the shoulder blades together before your elbows bend at all.",
      "Pull your chest toward the bar, keeping your elbows close to your body.",
      "Touch the bar at roughly mid-chest, not at your neck.",
      "Hold for a beat at the top and feel your back — not your arms — doing the work.",
      "Lower until your arms are completely straight and your shoulder blades spread apart.",
    ],
    breath: "Out as you pull, in as you lower.",
    tempo: "1 up, 1 second pause, 2 down.",
    mistakes: [
      { m: "Hips sagging toward the floor", f: "Squeeze the glutes. This is a plank that moves." },
      { m: "Pulling with the arms only", f: "Lead with the shoulder blades on every single rep." },
      { m: "Bar set too high, making it trivial", f: "Lower the bar or elevate your feet to keep it challenging." },
    ],
    easier: "Raise the bar, stand more upright", harder: "Elevate your feet, or row one arm",
    rx: "3–4 sets of 8–15 reps, 90 sec rest.",
  },
  {
    n: "Pike push-up", cat: "Push", lvl: "Intermediate", eq: "None",
    blurb: "The bridge between push-ups and handstand push-ups. Overhead pressing strength with no equipment.",
    prim: ["shoulders", "triceps"], sec: ["traps", "abs"],
    setup: "From a push-up position, walk your feet in and lift your hips high so your body makes an upside-down V. Arms and back in one straight line.",
    steps: [
      "Get your hips as high as your hamstrings allow. The more vertical your torso, the harder and more useful it is.",
      "Lower the crown of your head toward the floor slightly in front of your hands, not between them.",
      "Let your elbows travel forward and slightly out, around 45 degrees.",
      "Touch lightly, then press back until your arms lock out.",
      "Keep the hips high the whole time — don't let them drift back as you tire.",
    ],
    breath: "In down, out up.",
    tempo: "2 down, 1 up.",
    mistakes: [
      { m: "Hips dropping, turning it into a push-up", f: "Walk the feet closer and reset before the next rep." },
      { m: "Head going straight down between the hands", f: "Aim for a spot in front. It's a triangle, not a line." },
      { m: "Rushing the reps", f: "Slow the descent. Shoulders respond to time under tension." },
    ],
    easier: "Walk your feet further back", harder: "Feet elevated on a box",
    rx: "3–4 sets of 5–12 reps, 2 min rest.",
  },
  {
    n: "Wall handstand", cat: "Skill", lvl: "Intermediate", eq: "Wall",
    blurb: "Where every handstand starts. Chest to wall teaches the straight line you'll need freestanding.",
    prim: ["shoulders", "traps"], sec: ["abs", "forearms"],
    setup: "Always do two minutes of wrist prep first. Start in a push-up position with your feet on the wall, then walk your hands in as your feet walk up.",
    steps: [
      "Walk in until your chest and hips are close to the wall. This is chest-to-wall, and it's the version worth training.",
      "Push the floor away hard. Shoulders shrug up toward your ears, arms completely straight.",
      "Squeeze your ribs down and your glutes on so your back doesn't arch.",
      "Point your toes and press your legs together. Look at the floor between your hands, not forward.",
      "Come down the way you went up, one foot at a time, before your form breaks.",
    ],
    breath: "Short, shallow breaths. Don't hold your breath.",
    tempo: "Hold for time. End the set when the line breaks, not when you fail.",
    mistakes: [
      { m: "Back arching like a banana", f: "Ribs down, glutes on. Film yourself from the side — it never feels like it looks." },
      { m: "Bent arms", f: "Push harder through the floor. Bent-arm holds build the wrong pattern." },
      { m: "Skipping wrist prep", f: "Two minutes, every session. Wrists stop more people than shoulders do." },
    ],
    easier: "Feet on the wall, hands further out", harder: "Freestanding hold",
    rx: "5 sets of 20–45 seconds, full rest between.",
  },
  {
    n: "Hollow hold", cat: "Core & Abs", lvl: "Beginner", eq: "None",
    blurb: "The most useful core position in calisthenics. Every lever, handstand and clean pull-up uses it.",
    prim: ["abs"], sec: ["obliques", "quads"],
    setup: "Lie on your back, arms overhead, legs straight. Before you lift anything, press your lower back flat into the floor.",
    steps: [
      "Flatten the lower back first. This is the whole exercise — if it lifts, you've lost the position.",
      "Lift your shoulder blades and your legs off the floor at the same time.",
      "Reach your arms past your ears and point your toes to make the body long.",
      "Lower your legs only as far as you can while keeping the back flat.",
      "Hold, breathing shallowly. Stop the moment your lower back peels off the floor.",
    ],
    breath: "Small, shallow breaths through the ribs.",
    tempo: "Hold for time.",
    mistakes: [
      { m: "Lower back arching off the floor", f: "Raise the legs higher. Higher legs make it easier — go where you can hold the position." },
      { m: "Chin tucked into the chest", f: "Keep a gap about the size of a fist under your chin." },
      { m: "Holding your breath", f: "If you can't breathe, the variation is too hard." },
    ],
    easier: "Tuck hollow, knees bent", harder: "Hollow rock",
    rx: "3–4 sets of 20–60 seconds, 60 sec rest.",
  },
  {
    n: "Hanging leg raise", cat: "Core & Abs", lvl: "Intermediate", eq: "Pull-up bar",
    blurb: "Compression strength — the ability to fold. It carries straight into L-sits and front levers.",
    prim: ["abs"], sec: ["obliques", "forearms", "lats"],
    setup: "Hang from the bar with straight arms and active shoulders, pulled down rather than slumped.",
    steps: [
      "Pull your shoulders down out of your ears before the first rep, and keep them there.",
      "Tilt your pelvis under first, then lift. Starting with the pelvis is what makes this abs and not hip flexors.",
      "Raise your legs as high as you can without swinging — toes to bar if you can reach it.",
      "Lower slower than you lifted, all the way back to a straight hang.",
      "If you start swinging, stop. A swinging set trains nothing.",
    ],
    breath: "Out as you lift, in as you lower.",
    tempo: "1 up, 3 down.",
    mistakes: [
      { m: "Swinging between reps", f: "Pause dead still at the bottom for a full second before the next rep." },
      { m: "Only lifting the knees with the hips", f: "Curl the pelvis under first — the lower back should round slightly." },
      { m: "Dropping the legs", f: "The lowering half is where most of the strength gets built." },
    ],
    easier: "Hanging knee raise", harder: "Toes to bar",
    rx: "3–4 sets of 6–12 reps, 90 sec rest.",
  },
  {
    n: "Bodyweight squat", cat: "Legs", lvl: "Beginner", eq: "None",
    blurb: "The base of every lower-body progression, and a mobility drill in its own right.",
    prim: ["quads", "glutes"], sec: ["hams", "calves", "abs"],
    setup: "Feet about shoulder width, toes turned out slightly. Weight spread across the whole foot.",
    steps: [
      "Take a breath and brace your midsection before you move.",
      "Push your hips back and bend the knees at the same time. It isn't one and then the other.",
      "Let your knees travel forward and track over your toes. Knees past toes is normal and fine.",
      "Descend until your hip crease is below your knee, keeping your heels down.",
      "Drive the floor away and stand tall, squeezing the glutes at the top.",
    ],
    breath: "In at the top, brace, out on the way up.",
    tempo: "2 down, 1 up.",
    mistakes: [
      { m: "Heels lifting off the floor", f: "Usually ankle mobility. Work the deep squat hold, or elevate the heels while you build it." },
      { m: "Knees caving inward", f: "Think about screwing your feet into the floor to spread the knees." },
      { m: "Lower back rounding at the bottom", f: "Stop above that depth for now and widen your stance slightly." },
    ],
    easier: "Box squat", harder: "Split squat",
    rx: "3–4 sets of 15–30 reps, 60 sec rest.",
  },
  {
    n: "Split squat", cat: "Legs", lvl: "Intermediate", eq: "None",
    blurb: "One leg at a time. Fixes the imbalance almost everyone has and builds real single-leg control.",
    prim: ["quads", "glutes"], sec: ["hams", "abs"],
    setup: "Long stride, back heel lifted. Torso upright, hips square to the front.",
    steps: [
      "Set your stance long enough that your front shin stays close to vertical at the bottom.",
      "Lower straight down — the back knee travels toward the floor, not backward.",
      "Stop about an inch above the floor with the back knee.",
      "Push through the whole front foot to stand, keeping the weight off the back leg.",
      "Finish all your reps on one side before switching.",
    ],
    breath: "In down, out up.",
    tempo: "2 down, 1 up.",
    mistakes: [
      { m: "Stance too short", f: "It turns into a knee-dominant lunge. Step further out." },
      { m: "Pushing off the back foot", f: "The back leg is a kickstand, not an engine." },
      { m: "Torso collapsing forward", f: "Chest tall, midsection braced." },
    ],
    easier: "Hold a support for balance", harder: "Rear foot elevated",
    rx: "3–4 sets of 8–12 per leg, 90 sec rest.",
  },
  {
    n: "Chest-to-bar", cat: "Pull", lvl: "Advanced", eq: "Pull-up bar",
    blurb: "A pull-up with more range and more back. The last strength step before the muscle-up.",
    prim: ["lats", "biceps"], sec: ["traps", "abs"],
    setup: "Same grip as a pull-up. Dead hang, shoulders set down.",
    steps: [
      "Start the pull with the shoulder blades, exactly as in a strict pull-up.",
      "Lean back slightly from the shoulders — not by swinging, but by arching the upper back.",
      "Pull the bar toward your sternum, driving the elbows down and back.",
      "Touch the bar at chest level with your chest, not your chin or collarbone.",
      "Lower with control to a full hang before starting the next rep.",
    ],
    breath: "Out hard through the pull.",
    tempo: "1 up, 2–3 down.",
    mistakes: [
      { m: "Kipping to reach the chest", f: "If it needs a swing, drop back to strict pull-ups and build the strength first." },
      { m: "Touching with the collarbone", f: "Chest to bar means chest. Aim lower on your body." },
      { m: "Losing the hollow", f: "Ribs down. The lean comes from the upper back, not the lower." },
    ],
    easier: "Strict pull-up", harder: "Explosive pull-up",
    rx: "4–5 sets of 2–5 reps, 3 min rest.",
  },
  {
    n: "L-sit", cat: "Core & Abs", lvl: "Advanced", eq: "Parallettes",
    blurb: "Compression and straight-arm strength at once. Brutal, and one of the fastest skills to visibly improve.",
    prim: ["abs", "quads"], sec: ["triceps", "shoulders", "obliques"],
    setup: "Sit between parallettes or on the floor, hands pressing down beside your hips, arms locked straight.",
    steps: [
      "Lock your elbows and push the floor away hard. Shoulders press down, away from your ears.",
      "Lean your shoulders very slightly forward of your hands to shift the balance.",
      "Lift your legs straight out in front, knees locked, toes pointed.",
      "Aim for legs parallel to the floor or higher, with your hips level.",
      "Hold. Come down before the knees bend, not after.",
    ],
    breath: "Shallow. Do not hold your breath.",
    tempo: "Hold for time.",
    mistakes: [
      { m: "Bent elbows", f: "Straight arms are the whole point. Go back to tuck until you can lock out." },
      { m: "Slumped shoulders", f: "Push down actively. The shoulders should feel like they're driving away from your ears." },
      { m: "Knees bending to fake the height", f: "Extend one leg at a time instead and build it honestly." },
    ],
    easier: "Tuck L-sit", harder: "V-sit",
    rx: "5 sets of 10–20 seconds, full rest.",
  },
];

const findEx = (name) => {
  const c = name.toLowerCase().replace(/^(strict|scapular)\s+/, "").replace(/s$/, "");
  return LIB.find((x) => x.n.toLowerCase() === c) ||
    LIB.find((x) => c.includes(x.n.toLowerCase()) || x.n.toLowerCase().includes(c));
};

/* ─────────────────  MUSCLE MAP  ───────────────── */

function Body({ map, hl, label }) {
  return (
    <div className="bodywrap">
      <svg viewBox="0 0 80 145" className="body" aria-hidden="true">
        <ellipse cx="40" cy="26" rx="9" ry="10" className="skin" />
        <path d="M24 38h32v50H24z" className="skin" />
        <path d="M18 44h8v30h-8zM54 44h8v30h-8z" className="skin" />
        <path d="M29 88h9v46h-9zM42 88h9v46h-9z" className="skin" />
        {Object.entries(map).map(([m, paths]) =>
          paths.map((d, i) => <path key={m + i} d={d} className="mus" style={{ opacity: hl[m] || 0.08 }} />)
        )}
      </svg>
      <span className="eyebrow">{label}</span>
    </div>
  );
}

/* ─────────────────  EXERCISE DEMO  ───────────────── */

function Demo({ name }) {
  const [local, setLocal] = useState(null);
  const src = local || CLIPS[slug(name)] || "";

  useEffect(() => () => { if (local) URL.revokeObjectURL(local); }, [local]);
  useEffect(() => { setLocal(null); }, [name]);

  const pick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (f) setLocal(URL.createObjectURL(f));
  };

  if (src) {
    return (
      <div className="demo has">
        <video src={src} autoPlay loop muted playsInline className="clip" />
        <span className="demolab">{local ? "Local preview" : "Demo"}</span>
      </div>
    );
  }

  return (
    <div className="demo">
      <svg viewBox="0 0 120 70" width="100%" height="100%" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M8 14h104" opacity=".5" />
        <circle cx="60" cy="30" r="6" />
        <path d="M60 36v16M60 40l-11 9M60 40l11 9M54 22l-6-8M66 22l6-8" />
      </svg>
      <label className="addclip">
        <input type="file" accept="video/*" onChange={pick} />
        Add a clip
      </label>
      <span className="demolab">{slug(name)}</span>
    </div>
  );
}

/* ─────────────────  EXERCISE DETAIL  ───────────────── */

function ExerciseDetail({ ex, close, play }) {
  const [tab, setTab] = useState("how");
  const hl = {};
  ex.prim.forEach((m) => (hl[m] = 1));
  ex.sec.forEach((m) => (hl[m] = 0.4));

  return (
    <div className="player detail-full">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">{ex.cat}</div>
        <span style={{ width: 32 }} />
      </div>

      <div className="dscroll">
        <Demo name={ex.n} />
        <h1 className="disp exname" style={{ fontSize: 30, margin: "16px 0 10px" }}>{ex.n}</h1>
        <div className="chips" style={{ marginBottom: 10 }}>
          <span className="chip static">{ex.lvl}</span>
          <span className="chip static">{ex.eq}</span>
        </div>
        <p className="pdesc" style={{ marginTop: 0 }}>{ex.blurb}</p>

        <div className="seg2" style={{ marginTop: 18 }}>
          {[["how", "How to"], ["mistakes", "Mistakes"], ["muscles", "Muscles"]].map(([k, l]) => (
            <button key={k} className={tab === k ? "act" : ""} onClick={() => setTab(k)}>{l}</button>
          ))}
        </div>

        {tab === "how" && (
          <>
            <section className="card">
              <span className="eyebrow">Set up</span>
              <p className="pdesc" style={{ marginTop: 8 }}>{ex.setup}</p>
            </section>
            <span className="eyebrow" style={{ display: "block", marginBottom: 8 }}>Step by step</span>
            <ol className="steps2">
              {ex.steps.map((t, i) => (
                <li key={i}><span className="snum">{i + 1}</span><p>{t}</p></li>
              ))}
            </ol>
            <div className="twocol">
              <div className="minicard"><span className="eyebrow">Breathing</span><p>{ex.breath}</p></div>
              <div className="minicard"><span className="eyebrow">Tempo</span><p>{ex.tempo}</p></div>
            </div>
            <section className="card lit" style={{ marginTop: 12 }}>
              <span className="eyebrow">Prescription</span>
              <p className="pdesc" style={{ marginTop: 8 }}>{ex.rx}</p>
            </section>
          </>
        )}

        {tab === "mistakes" && (
          <>
            <p className="pdesc" style={{ margin: "4px 0 14px" }}>
              The three that actually cost people progress on this movement.
            </p>
            {ex.mistakes.map((k, i) => (
              <section className="card mistake" key={i}>
                <div className="mrow"><span className="mx">✕</span><b>{k.m}</b></div>
                <div className="mrow fix"><span className="mv">✓</span><p>{k.f}</p></div>
              </section>
            ))}
          </>
        )}

        {tab === "muscles" && (
          <>
            <div className="bodies">
              <Body map={M_FRONT} hl={hl} label="Front" />
              <Body map={M_BACK} hl={hl} label="Back" />
            </div>
            <div className="mlegend">
              <div>
                <span className="eyebrow">Primary</span>
                <p>{ex.prim.map((m) => MNAMES[m]).join(", ")}</p>
              </div>
              <div>
                <span className="eyebrow">Also worked</span>
                <p className="dim">{ex.sec.map((m) => MNAMES[m]).join(", ")}</p>
              </div>
            </div>
          </>
        )}

        <div className="rung">
          <div className="rungbox">
            <span className="eyebrow">Too hard? Do this</span>
            <b>{ex.easier}</b>
          </div>
          <div className="rungbox">
            <span className="eyebrow">Too easy? Go to</span>
            <b>{ex.harder}</b>
          </div>
        </div>

        {play && (
          <button className="btn primary" style={{ marginTop: 18 }}
            onClick={() => { close(); play({ id: "single", t: ex.n, cat: ex.cat, lvl: ex.lvl, min: 12, eq: ex.eq, d: ex.blurb, ex: [mk(ex.n, "4 × 8")] }); }}>
            Practise this now
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────────  LIBRARY  ───────────────── */

function Library({ openEx }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const cats = ["All", "Push", "Pull", "Legs", "Core", "Skill"];
  const list = LIB.filter((e) => (cat === "All" || e.cat === cat) && e.n.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="rise d2">
      <div className="searchbox">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
          <circle cx="9" cy="9" r="5.5" /><path d="M13 13l4 4" />
        </svg>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search exercises" aria-label="Search exercises" />
      </div>
      <div className="chips" style={{ marginBottom: 16 }}>
        {cats.map((c) => (
          <button key={c} className={`chip${cat === c ? " on" : ""}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>
      <Head l={`${list.length} exercise${list.length === 1 ? "" : "s"}`} r="Full instructions" />
      {list.length === 0 && <div className="empty">No exercise matches that.</div>}
      {list.map((e) => (
        <button className="wcard" key={e.n} onClick={() => openEx(e)}>
          <div>
            <div className="wtitle">{e.n}</div>
            <div className="wmeta">{e.lvl} · {e.eq} · {e.prim.map((m) => MNAMES[m]).join(", ")}</div>
          </div>
          <span className="wcat">{e.cat}</span>
        </button>
      ))}
    </div>
  );
}

/* ─────────────────  AUTH  ───────────────── */

const PLANS = [
  {
    k: "pro", l: "Pro", p: "€3.99", sub: "per month", note: "Cancel any time",
    perks: [
      "All 7 programmes, including muscle-up",
      "Unlimited generated sessions",
      "Advanced skills — front lever and back lever",
      "Detailed statistics and full history",
      "Offline workouts",
    ],
  },
  {
    k: "premium", l: "Premium", p: "€9.99", sub: "per month", best: "Most complete",
    note: "Everything in Pro, plus coaching",
    perks: [
      "Everything in Pro",
      "Elite skills — planche, human flag, one-arm pull-up",
      "Form check — send a clip, get it reviewed",
      "A weekly plan built around your assessment",
      "Full nutrition plans with macro targets",
      "New programmes before anyone else",
    ],
  },
  {
    k: "life", l: "Lifetime", p: "€59.99", sub: "one payment", note: "No renewal, ever",
    perks: [
      "Everything in Premium, permanently",
      "Every future programme included",
      "Founder badge on your profile",
      "Your price never goes up",
    ],
  },
];

const TIERCOLS = [
  { k: "free", l: "Free", p: "€0" },
  { k: "pro", l: "Pro", p: "€3.99" },
  { k: "premium", l: "Premium", p: "€9.99" },
  { k: "life", l: "Life", p: "€59.99" },
];

const MATRIX = [
  { g: "Training", rows: [
    ["The 6-day split", "free"],
    ["Daily workout and challenge", "free"],
    ["Workout player, timer, voice coach", "free"],
    ["3 starter programmes", "free"],
    ["All 7 programmes", "pro"],
    ["Unlimited generated sessions", "pro"],
    ["Run several programmes at once", "pro"],
  ]},
  { g: "Skills", rows: [
    ["Foundation paths — pull, push, handstand, L-sit, legs", "free"],
    ["Advanced — front lever, back lever", "pro"],
    ["Elite — planche, human flag, one-arm pull-up", "premium"],
  ]},
  { g: "Tracking", rows: [
    ["Records, history and streaks", "free"],
    ["Body rating assessment", "free"],
    ["Detailed statistics", "pro"],
    ["Offline workouts", "pro"],
  ]},
  { g: "Coaching", rows: [
    ["Form check — send a clip, get it reviewed", "premium"],
    ["Weekly plan built from your assessment", "premium"],
    ["Full nutrition plans and macro targets", "premium"],
    ["New programmes before anyone else", "premium"],
  ]},
  { g: "Lifetime only", rows: [
    ["Every future programme included", "life"],
    ["Founder badge on your profile", "life"],
    ["Your price never goes up", "life"],
  ]},
];

/* Accounts that get Lifetime automatically — the creator's own.
   Client-side only, so treat it as convenience, not security: anyone can
   read this list in the bundle. Move it server-side with real auth. */
const COMPED = [];
const isComped = (e) => COMPED.includes(String(e || "").trim().toLowerCase());

const RANK = { free: 0, pro: 1, premium: 2, life: 3 };
const has = (tier, need) => RANK[tier || "free"] >= RANK[need];
const planName = (t) => (PLANS.find((x) => x.k === t) || {}).l || "Free";

const CREATOR = {
  handle: "vertx.lh44",
  yt: "vertx.ae.44",
  links: [
    { p: "Instagram", h: "@vertx.lh44", u: "https://instagram.com/vertx.lh44" },
    { p: "TikTok", h: "@vertx.lh44", u: "https://tiktok.com/@vertx.lh44" },
    { p: "YouTube", h: "@vertx.ae.44", u: "https://youtube.com/@vertx.ae.44" },
  ],
};

const CREAVOA = {
  n: "Creavoa",
  tag: "AI brand intelligence for creators",
  d: "The other thing I build. It writes scripts, plans content and tracks growth in your voice — not in generic creator voice.",
  tools: [
    ["Script Generator", "Hook, body and CTA in your own voice"],
    ["Content Calendar", "What's shipping and when, planned to posted"],
    ["Idea Validator", "Go, no-go or pivot before you waste an hour"],
    ["Growth Plan", "A real 90-day roadmap, not a template"],
    ["Analytics", "Every platform in one place"],
    ["Wins Log", "Proof you're onto something, for the days you doubt it"],
  ],
  count: 11,
  home: "https://creatoros-seven.vercel.app",
  dash: "https://creatoros-seven.vercel.app/dashboard",
  join: "https://creatoros-seven.vercel.app/signup",
  price: "https://creatoros-seven.vercel.app/pricing",
};


/* 6-day calisthenics split — push / pull / legs, run twice a week */
/* ─────────────────  6-DAY PPL + CORE  ─────────────────
   Three authored programmes — beginner, intermediate, advanced. Each is a
   full week written for that athlete, not the same week with the numbers
   nudged. Selecting a level loads the matching progression. */
const WEEK_DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

const PPL = {
  Beginner: [
    { d: "MON", t: "Push + Core", k: "Push", min: 35, ex: [
      mk("Incline push-ups", "3 × 8–12"), mk("Knee / regular push-ups", "3 × 6–10"),
      mk("Pike push-ups", "2 × 5–8"), mk("Bench or chair dips", "2 × 6–10"),
      mk("Plank", "3 × 20–40s"), mk("Dead bugs", "2 × 8–12 per side")] },
    { d: "TUE", t: "Pull + Core", k: "Pull", min: 35, ex: [
      mk("Assisted pull-ups", "3 × 3–6"), mk("Inverted rows", "3 × 6–12"),
      mk("Scapular pull-ups", "2 × 6–10"), mk("Superman", "2 × 10–15"),
      mk("Hanging knee raises", "3 × 6–10"), mk("Side plank", "2 × 15–30s per side")] },
    { d: "WED", t: "Legs + Core", k: "Legs", min: 35, ex: [
      mk("Bodyweight squats", "3 × 10–15"), mk("Reverse lunges", "3 × 8–12 per leg"),
      mk("Glute bridges", "3 × 10–15"), mk("Calf raises", "3 × 15–20"),
      mk("Plank", "3 × 20–40s"), mk("Bird dogs", "2 × 8–12 per side")] },
    { d: "THU", t: "Push + Core", k: "Push", min: 35, ex: [
      mk("Push-ups", "3 × 6–12"), mk("Incline push-ups", "2 × 8–12"),
      mk("Pike push-ups", "2 × 5–8"), mk("Dips progression", "2 × 5–8"),
      mk("Dead bugs", "3 × 8–12 per side"), mk("Plank", "2 × 30s")] },
    { d: "FRI", t: "Pull + Core", k: "Pull", min: 35, ex: [
      mk("Assisted pull-ups", "3 × 4–6"), mk("Inverted rows", "3 × 8–12"),
      mk("Negative pull-ups", "2 × 3–5"), mk("Superman", "3 × 10–15"),
      mk("Hanging knee raises", "3 × 8–12"), mk("Side plank", "2 × 20–30s per side")] },
    { d: "SAT", t: "Legs + Core", k: "Legs", min: 35, ex: [
      mk("Squats", "3 × 12–15"), mk("Split squats", "3 × 8–10 per leg"),
      mk("Glute bridges", "3 × 12–15"), mk("Calf raises", "3 × 15–20"),
      mk("Hollow-body progression", "3 × 15–25s"), mk("Plank", "2 × 30–40s")] },
  ],

  Intermediate: [
    { d: "MON", t: "Push A", k: "Push", min: 45, ex: [
      mk("Push-ups", "3 × 8–15"), mk("Dips", "3 × 6–10"),
      mk("Pike push-ups", "3 × 6–10"), mk("Decline push-ups", "3 × 6–12"),
      mk("L-sit progression", "3 × 10–20s"), mk("Hollow hold", "3 × 20–40s")] },
    { d: "TUE", t: "Pull A", k: "Pull", min: 45, ex: [
      mk("Pull-ups", "4 × 4–8"), mk("Chin-ups", "3 × 5–10"),
      mk("Inverted rows", "3 × 8–15"), mk("Scapular pull-ups", "2 × 8–12"),
      mk("Hanging knee raises", "3 × 8–15"), mk("Side plank", "3 × 20–40s")] },
    { d: "WED", t: "Legs A", k: "Legs", min: 45, ex: [
      mk("Bulgarian split squats", "3 × 8–12 per leg"), mk("Squats", "3 × 12–20"),
      mk("Reverse lunges", "3 × 10 per leg"), mk("Single-leg glute bridges", "3 × 10–15"),
      mk("Calf raises", "4 × 15–20"), mk("Hollow hold", "3 × 20–40s")] },
    { d: "THU", t: "Push B", k: "Push", min: 45, ex: [
      mk("Decline push-ups", "3 × 8–12"), mk("Dips", "4 × 6–10"),
      mk("Pike push-ups", "3 × 8–12"), mk("Diamond push-ups", "3 × 6–12"),
      mk("L-sit", "3 × 10–20s"), mk("Plank", "3 × 30–60s")] },
    { d: "FRI", t: "Pull B", k: "Pull", min: 45, ex: [
      mk("Pull-ups", "4 × 5–8"), mk("Chin-ups", "3 × 6–10"),
      mk("Inverted rows", "3 × 10–15"), mk("Explosive pull-up progression", "3 × 3–5"),
      mk("Hanging leg raises", "3 × 8–12"), mk("Hollow hold", "3 × 20–40s")] },
    { d: "SAT", t: "Legs B", k: "Legs", min: 45, ex: [
      mk("Bulgarian split squats", "4 × 8–12 per leg"), mk("Walking lunges", "3 × 10–15 per leg"),
      mk("Single-leg squat progression", "3 × 5–8 per leg"), mk("Glute bridges", "3 × 12–15"),
      mk("Calf raises", "4 × 15–25"), mk("Hanging knee raises", "3 × 8–15")] },
  ],

  Advanced: [
    { d: "MON", t: "Push A + Core", k: "Push", min: 55, ex: [
      mk("Advanced push-up progression", "4 × 5–10"), mk("Dips", "4 × 6–10"),
      mk("Handstand push-up progression", "3 × 3–8"), mk("Pseudo-planche push-ups", "3 × 5–10"),
      mk("L-sit", "4 × 15–30s"), mk("Hollow hold", "3 × 30–45s")] },
    { d: "TUE", t: "Pull A + Core", k: "Pull", min: 55, ex: [
      mk("Pull-ups", "4 × 5–8"), mk("Chin-ups", "3 × 6–10"),
      mk("Front-lever progression", "4 × controlled"), mk("Explosive pull-ups", "3 × 3–6"),
      mk("Hanging leg raises", "3 × 8–15"), mk("Side plank", "3 × 30–45s")] },
    { d: "WED", t: "Legs A + Core", k: "Legs", min: 55, ex: [
      mk("Bulgarian split squats", "4 × 8–12 per leg"), mk("Pistol-squat progression", "3 × 5–8 per leg"),
      mk("Jump squats", "3 × 6–10"), mk("Single-leg glute bridges", "3 × 10–15"),
      mk("Calf raises", "4 × 15–25"), mk("Hollow hold", "3 × 30–45s")] },
    { d: "THU", t: "Push B + Core", k: "Push", min: 55, ex: [
      mk("Dips", "4 × 6–10"), mk("Decline push-ups", "3 × 8–15"),
      mk("Handstand push-up progression", "3 × 3–8"), mk("Planche progression", "4 × controlled"),
      mk("L-sit", "4 × 15–30s"), mk("Dragon-flag progression", "3 × controlled")] },
    { d: "FRI", t: "Pull B + Core", k: "Pull", min: 55, ex: [
      mk("Pull-ups", "4 × 5–8"), mk("Muscle-up progression", "4 × controlled"),
      mk("Front-lever progression", "3 × controlled"), mk("Chin-ups", "3 × 6–10"),
      mk("Hanging leg raises", "3 × 8–15"), mk("Hollow rocks", "3 × 10–20")] },
    { d: "SAT", t: "Legs B + Core", k: "Legs", min: 55, ex: [
      mk("Pistol-squat progression", "4 × 5–8 per leg"), mk("Bulgarian split squats", "3 × 8–12 per leg"),
      mk("Walking lunges", "3 × 12 per leg"), mk("Single-leg calf raises", "4 × 15–25"),
      mk("L-sit", "3 × 15–30s"), mk("Plank", "3 × 45–60s")] },
  ],
};

const TYPE_TINT = { Push: "var(--neon)", Pull: "#5CC8FF", Legs: "#FFA24B" };

const SPLIT_CATS = ["Push", "Pull", "Legs"];

const MEALTAGS = ["All", "High protein", "High carb", "Pre-workout", "Post-workout", "Snack"];
const MEALPLAN = [
  { n: "Chicken, rice and broccoli", k: 640, p: 55, c: 70, f: 12, tag: "High protein", d: "The default. Cheap, scales up, freezes well." },
  { n: "Oats, banana, peanut butter, milk", k: 620, p: 32, c: 80, f: 18, tag: "High carb", d: "Slow carbs that don't sit heavy before a session." },
  { n: "Tuna, rice and kimchi", k: 550, p: 48, c: 65, f: 6, tag: "High protein", d: "Five minutes, almost no fat, huge protein hit." },
  { n: "Lentil pasta bolognese", k: 700, p: 40, c: 90, f: 14, tag: "High carb", d: "Best meal the night before a heavy pull day." },
  { n: "Rice cakes, honey and a banana", k: 320, p: 4, c: 72, f: 2, tag: "Pre-workout", d: "Fast carbs, low fibre. Eat 45 minutes out." },
  { n: "Greek yoghurt, granola, berries", k: 420, p: 30, c: 55, f: 8, tag: "Post-workout", d: "Protein and carbs together, no cooking." },
  { n: "Eggs, sourdough and avocado", k: 560, p: 28, c: 42, f: 30, tag: "High protein", d: "Keeps you full through a long morning." },
  { n: "Salmon, potatoes and salad", k: 620, p: 42, c: 55, f: 22, tag: "High protein", d: "Protein with real volume on the plate." },
  { n: "Beef mince, potatoes, veg", k: 680, p: 50, c: 60, f: 24, tag: "High carb", d: "Batch six portions on a Sunday." },
  { n: "Cottage cheese and fruit", k: 300, p: 32, c: 25, f: 6, tag: "Snack", d: "Slow protein. Good last thing at night." },
];

const MIN_AGE = 13;

const ageFrom = (d) => {
  const b = new Date(d);
  if (!d || isNaN(b.getTime())) return null;
  const t = new Date();
  let a = t.getFullYear() - b.getFullYear();
  const m = t.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
  return a;
};
/* Age bands drive what the app is allowed to show.
   Food logging and any body score are adults-only by design, not by preference. */
const capsFor = (age) => ({
  fuel: age >= 16,
  rating: age >= 16,
  buy: age >= 18,
});

const LEVELS = [
  ["Beginner", "New to this, or coming back after a long break"],
  ["Intermediate", "I can do a few strict pull-ups and full push-ups"],
  ["Advanced", "I train skills — levers, handstands, muscle-ups"],
];
/* Goal is what you're chasing. Purpose is why — different question,
   and the one that actually predicts whether someone still trains in March. */
const PURPOSES = [
  ["Get genuinely strong", "Strength for its own sake — I want to be capable"],
  ["Feel better day to day", "Energy, posture, sleep, less aching"],
  ["Look the way I want", "Build the physique I'm after"],
  ["Come back from a break", "I've trained before and I've fallen off"],
  ["Clear my head", "Training is how I manage stress"],
  ["Learn something hard", "I want to master a skill most people can't do"],
];

const GOALS = [
  "Learn skills", "Build muscle", "Better physique", "Get stronger",
  "Muscle-up", "Handstand", "Front lever", "Lose fat", "Stay consistent",
];

function CheckEmail({ email, sentAt, onResend, onBack }) {
  const [wait, setWait] = useState(60);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    const tick = () => setWait(Math.max(60 - Math.floor((Date.now() - sentAt) / 1000), 0));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [sentAt]);

  return (
    <div className="auth">
      <div className="authtop narrow">
        <button className="backbtn" onClick={onBack} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <h1 className="disp authh">Check your email</h1>
        <p className="meta">
          We've sent a confirmation link to <b className="emailhl">{email}</b>. Open it to finish setting up your
          account — this page will pick up automatically once you do.
        </p>

        <div className="resend" style={{ marginTop: 20 }}>
          {wait > 0 ? (
            <span className="meta">Didn't get it? You can send another in {wait}s.</span>
          ) : (
            <button className="peek" style={{ margin: 0 }} onClick={() => { onResend(); setSent(true); }}>
              {sent ? "Sent — check your inbox" : "Send another link"}
            </button>
          )}
        </div>
      </div>

      <div className="authfoot">
        <button className="peek" onClick={onBack}>Wrong address? Go back</button>
      </div>
    </div>
  );
}

function Auth({ start, pendingProfile }) {
  const [mode, setMode] = useState(pendingProfile ? "level" : "welcome");
  const [name, setName] = useState(pendingProfile?.name || "");
  const [email, setEmail] = useState(pendingProfile?.email || "");
  const [pw, setPw] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState({});
  const [busy, setBusy] = useState(false);
  const [lvl, setLvl] = useState(null);
  const [goal, setGoal] = useState([]);
  const [why, setWhy] = useState(null);
  const [dob, setDob] = useState("");
  const [sentAt, setSentAt] = useState(0);

  useEffect(() => {
    if (pendingProfile && mode === "welcome") {
      setName(pendingProfile.name);
      setEmail(pendingProfile.email);
      setMode("level");
    }
  }, [pendingProfile]);

  const okEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const strength = pw.length >= 12 && /[^a-zA-Z0-9]/.test(pw) ? 3 : pw.length >= 8 ? 2 : pw.length >= 5 ? 1 : 0;
  const STR = ["", "Too short", "Good", "Strong"];

  const submit = async () => {
    const e = {};
    if (mode === "signup" && name.trim().length < 2) e.name = "Tell us what to call you.";
    if (!okEmail) e.email = email ? "That doesn't look like an email address." : "Enter your email.";
    if (mode === "signup" && pw.length < 8) e.pw = "Use at least 8 characters.";
    if (mode === "login" && !pw) e.pw = "Enter your password.";
    if (signup) {
      const a = ageFrom(dob);
      if (a === null) e.dob = "Enter your date of birth.";
      else if (a < MIN_AGE) e.dob = `Skilxz is for ages ${MIN_AGE} and up.`;
      else if (a > 110) e.dob = "Check that date.";
    }
    setErr(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email, password: pw, options: { data: { name: name.trim() } } });
      setBusy(false);
      if (error) { setErr({ email: error.message }); return; }
      setSentAt(Date.now());
      setMode("verify");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
      setBusy(false);
      if (error) { setErr({ pw: "Incorrect email or password." }); return; }
      // A valid session is now live — the app-level listener picks it up from here.
    }
  };

  if (mode === "welcome") {
    return (
      <div className="auth">
        <div className="authtop">
          <div className="logolock">
            <span className="logomark big"><Mark size={54} /></span>
            <div className="mark big">SKIL<span>X</span>Z</div>
          </div>
          <p className="authtag disp">Build strength.<br />Master your body.</p>
          <p className="meta" style={{ marginTop: 12 }}>
            Bodyweight training that tracks the skill, not just the session.
          </p>
        </div>
        <div className="authfoot">
          <button className="btn primary" onClick={() => setMode("signup")}>Create account</button>
          <button className="btn outline" onClick={() => setMode("login")}>I already have one</button>
          <div className="or"><span>or</span></div>
          <div className="btnrow">
            <button className="btn ghost" disabled title="Coming soon">Apple</button>
            <button
              className="btn ghost"
              onClick={() => supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } })}
            >
              Google
            </button>
          </div>
          <p className="fine" style={{ marginTop: 16 }}>
            By continuing you agree to the terms and privacy policy. You must be 13 or older to create an account.
          </p>
        </div>
      </div>
    );
  }

  if (mode === "verify") {
    return (
      <CheckEmail
        email={email}
        sentAt={sentAt}
        onResend={async () => {
          setSentAt(Date.now());
          await supabase.auth.resend({ type: "signup", email });
        }}
        onBack={() => setMode("signup")}
      />
    );
  }

  if (mode === "dob" || mode === "level" || mode === "goal" || mode === "why") {
    const STEPS = pendingProfile ? ["dob", "level", "goal", "why"] : ["level", "goal", "why"];
    const idx = STEPS.indexOf(mode);
    const copy = {
      dob: ["When were you born?", "Keeps a couple of features age-appropriate. Never shown to anyone else."],
      level: ["Where are you now?", "This sets your starting point on the skill tree. You can retest any time."],
      goal: ["What are you chasing?", "Pick as many as you like — it shapes what the app puts in front of you."],
      why: ["And why?", "The honest answer. It's what the coach leans on when a week goes badly."],
    }[mode];
    const ready = mode === "dob" ? ageFrom(dob) !== null : mode === "level" ? !!lvl : mode === "goal" ? goal.length > 0 : !!why;

    return (
      <div className="auth">
        <div className="authtop narrow">
          <span className="eyebrow">Step {idx + 1} of {STEPS.length}</span>
          <h1 className="disp authh">{copy[0]}</h1>
          <p className="meta">{copy[1]}</p>

          <div className="obwrap">
            {mode === "dob" && (
              <label className="field">
                <span className="eyebrow">Date of birth</span>
                <input className="input" type="date" value={dob}
                  max={new Date().toISOString().slice(0, 10)} autoComplete="bday"
                  onChange={(e) => setDob(e.target.value)} />
                <span className="hint">You need to be {MIN_AGE} or older to use Skilxz.</span>
              </label>
            )}

            {mode === "level" &&
              LEVELS.map(([k, d]) => (
                <button key={k} className={`ob${lvl === k ? " on" : ""}`} onClick={() => setLvl(k)}>
                  <span className="obn">{k}</span>
                  <span className="obd">{d}</span>
                </button>
              ))}

            {mode === "goal" && (
              <div className="chips">
                {GOALS.map((g) => (
                  <button
                    key={g}
                    className={`chip${goal.includes(g) ? " on" : ""}`}
                    onClick={() => setGoal((x) => (x.includes(g) ? x.filter((y) => y !== g) : [...x, g]))}
                  >
                    {g}
                  </button>
                ))}
              </div>
            )}

            {mode === "why" &&
              PURPOSES.map(([k, d]) => (
                <button key={k} className={`ob${why === k ? " on" : ""}`} onClick={() => setWhy(k)}>
                  <span className="obn">{k}</span>
                  <span className="obd">{d}</span>
                </button>
              ))}
          </div>
        </div>

        <div className="authfoot">
          <button
            className="btn primary"
            disabled={!ready}
            onClick={async () => {
              if (idx < STEPS.length - 1) { setMode(STEPS[idx + 1]); return; }
              const age = ageFrom(dob);
              await supabase.auth.updateUser({ data: { name: name.trim(), lvl, goal, why, age } }).catch(() => {});
              start({ name: name.trim(), email, lvl, goal, why, age });
            }}
          >
            {idx === STEPS.length - 1 ? "Start training" : mode === "goal" && goal.length ? `Continue (${goal.length})` : "Continue"}
          </button>
          <button
            className="peek"
            onClick={() => {
              if (idx === 0) {
                if (pendingProfile) { supabase.auth.signOut(); setMode("welcome"); }
                else setMode("signup");
              } else setMode(STEPS[idx - 1]);
            }}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  const signup = mode === "signup";
  return (
    <div className="auth">
      <div className="authtop narrow">
        <button className="backbtn" onClick={() => setMode("welcome")} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3L5 8l5 5" /></svg>
        </button>
        <h1 className="disp authh">{signup ? "Create your account" : "Welcome back"}</h1>
        <p className="meta">{signup ? "Your progress, records and skill tree live here." : "Pick up where you left off."}</p>

        <div className="form">
          {signup && (
            <label className="field">
              <span className="eyebrow">Name</span>
              <input className={err.name ? "input bad" : "input"} type="text" value={name} placeholder="Mika"
                autoComplete="name" onChange={(e) => setName(e.target.value)}
                onFocus={() => setErr((x) => ({ ...x, name: null }))} />
              {err.name && <span className="err">{err.name}</span>}
            </label>
          )}
          {signup && (
            <label className="field">
              <span className="eyebrow">Date of birth</span>
              <input className={err.dob ? "input bad" : "input"} type="date" value={dob}
                max={new Date().toISOString().slice(0, 10)} autoComplete="bday"
                onChange={(e) => setDob(e.target.value)}
                onFocus={() => setErr((x) => ({ ...x, dob: null }))} />
              {err.dob && <span className="err">{err.dob}</span>}
              {!err.dob && <span className="hint">You need to be {MIN_AGE} or older to use Skilxz.</span>}
            </label>
          )}
          <label className="field">
            <span className="eyebrow">Email</span>
            <input className={err.email ? "input bad" : "input"} type="email" value={email} placeholder="you@example.com"
              autoComplete="email" inputMode="email" onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setErr((x) => ({ ...x, email: null }))} />
            {err.email && <span className="err">{err.email}</span>}
          </label>
          <label className="field">
            <span className="eyebrow">Password</span>
            <span className="pwwrap">
              <input className={err.pw ? "input bad" : "input"} type={show ? "text" : "password"} value={pw}
                placeholder={signup ? "At least 8 characters" : "Your password"}
                autoComplete={signup ? "new-password" : "current-password"}
                onChange={(e) => setPw(e.target.value)}
                onFocus={() => setErr((x) => ({ ...x, pw: null }))} />
              <button type="button" className="pwtog" onClick={() => setShow(!show)}>{show ? "Hide" : "Show"}</button>
            </span>
            {err.pw && <span className="err">{err.pw}</span>}
            {signup && pw.length > 0 && (
              <span className="strength"><i className={`s${strength}`} /><em>{STR[strength]}</em></span>
            )}
          </label>
        </div>
      </div>

      <div className="authfoot">
        <button className="btn primary" onClick={submit} disabled={busy}>
          {busy ? "One moment…" : signup ? "Create account" : "Log in"}
        </button>
        <button className="peek" onClick={() => { setErr({}); setMode(signup ? "login" : "signup"); }}>
          {signup ? "I already have an account" : "Create an account instead"}
        </button>
      </div>
    </div>
  );
}

function Plans({ close, buy, tier }) {
  const [plan, setPlan] = useState("premium");
  const [table, setTable] = useState(false);
  const chosen = PLANS.find((x) => x.k === plan);
  const owned = has(tier, plan);

  return (
    <div className="player plans-screen">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close plans">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">Membership</div>
        <span style={{ width: 32 }} />
      </div>

      <div className="planscroll">
        <div className="planhero">
          <Logo size={26} />
          <h1 className="disp authh" style={{ marginTop: 18 }}>Choose your level</h1>
          <p className="meta">
            {tier === "free"
              ? "The app is free forever. These open the rest of it."
              : `You're on ${planName(tier)}.`}
          </p>
        </div>

        <div className="plans">
          {PLANS.map((x) => (
            <button key={x.k} className={`plan${plan === x.k ? " on" : ""}`} onClick={() => setPlan(x.k)}>
              <span className="planl">
                {x.l}
                {x.best && <span className="best">{x.best}</span>}
                {has(tier, x.k) && <span className="best owned">Active</span>}
              </span>
              <span className="planp disp">{x.p}<em>{x.sub}</em></span>
              <span className="plann">{x.note}</span>
            </button>
          ))}
        </div>

        <div className="perkbox">
          <span className="eyebrow">{chosen.l} includes</span>
          <ul className="prolist">{chosen.perks.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>

        <button className="peek" onClick={() => setTable(!table)}>
          {table ? "Hide full comparison" : "Compare all four side by side"}
        </button>

        {table && (
          <div className="matrix">
            <div className="mrow mhead">
              <span className="mlab" />
              {TIERCOLS.map((c) => (
                <span key={c.k} className={`mcol${plan === c.k ? " on" : ""}`}>
                  <b>{c.l}</b>
                  <em>{c.p}</em>
                </span>
              ))}
            </div>
            {MATRIX.map((g) => (
              <div key={g.g}>
                <div className="mgroup eyebrow">{g.g}</div>
                {g.rows.map(([label, need]) => (
                  <div className="mrow" key={label}>
                    <span className="mlab">{label}</span>
                    {TIERCOLS.map((c) => (
                      <span key={c.k} className={`mcol${plan === c.k ? " on" : ""}`}>
                        {has(c.k, need) ? (
                          <svg className="mtick" viewBox="0 0 12 12" fill="none"><path d="M2.5 6.3l2.4 2.4L9.5 3.6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        ) : (
                          <span className="mdash" />
                        )}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        <p className="fine" style={{ marginTop: 18 }}>
          Monthly plans renew automatically unless cancelled, and you can manage or cancel any time in your store
          account. Lifetime is a single payment with no renewal. Purchases from a child account are sent to a
          parent for approval by the App Store or Google Play.
        </p>
      </div>

      <div className="planfoot">
        <button className="btn primary" disabled={owned} onClick={() => buy(chosen)}>
          {owned ? `${chosen.l} already active` : `Start ${chosen.l} — ${chosen.p}`}
        </button>
        <button className="peek" onClick={close}>Not now</button>
      </div>
    </div>
  );
}

/* ─────────────────  AI CORE  ─────────────────
   Radial hub: every AI capability orbits the coach. Node positions are
   percentages of a 100×115 field, shared by the cards and the SVG lines
   so the connectors always land on the cards. */
const NODES = [
  { k: "coach",  l: "COACH",   sub: "/ask",      x: 50, y: 12,  need: "free" },
  { k: "build",  l: "BUILD",   sub: "/session",  x: 80, y: 24,  need: "free" },
  { k: "skills", l: "SKILLS",  sub: "/tree",     x: 88, y: 55,  need: "free" },
  { k: "form",   l: "FORM",    sub: "/check",    x: 78, y: 87,  need: "premium" },
  { k: "plan",   l: "PLAN",    sub: "/week",     x: 48, y: 101, need: "premium" },
  { k: "scan",   l: "SCAN",    sub: "/meal",     x: 19, y: 87,  need: "free" },
  { k: "stats",  l: "READ",    sub: "/progress", x: 11, y: 55,  need: "free" },
  { k: "voice",  l: "VOICE",   sub: "/handsfree", x: 20, y: 24, need: "free" },
];

function Core({ close, open, tier, used, streak, score, days, upgrade }) {
  const [clock, setClock] = useState("");
  const [sel, setSel] = useState(null);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const limits = has(tier, "pro")
    ? [["COACH", "∞"], ["SESSIONS", "∞"], ["SCANS", "∞"]]
    : [["COACH", `${used}/${FREE_MSGS}`], ["SESSIONS", "0/1"], ["SCANS", "0/3"]];

  const tap = (n) => {
    if (!has(tier, n.need)) { setSel(n.k); upgrade(); return; }
    setSel(n.k);
    open(n.k);
  };

  return (
    <div className="player core">
      <div className="corebar">
        <span className="cmono b">CORE</span>
        <span className="cmono dim">/ SKILXZ COMMAND</span>
        <span className="corestats">
          <span className="cstat"><b>{streak}</b><em>DAY STREAK</em></span>
          <span className="cstat"><b>{score}</b><em>BODY SCORE</em></span>
          <span className="cstat"><b>{days}</b><em>SESSIONS</em></span>
          <span className="cmono dim clock">{clock}</span>
        </span>
        <button className="close" onClick={close} aria-label="Close core">
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
      </div>

      <div className="usage">
        <span className="cmono dim">USAGE</span>
        {limits.map(([l, v]) => (
          <span className="urow" key={l}><em>{l}</em><b>{v}</b></span>
        ))}
      </div>

      <div className="field">
        <svg className="wires" viewBox="0 0 100 115" preserveAspectRatio="none" aria-hidden="true">
          {NODES.map((n) => (
            <line key={n.k} x1="50" y1="55" x2={n.x} y2={n.y}
              className={`wire${sel === n.k ? " hot" : ""}`} />
          ))}
        </svg>

        <div className="rings" aria-hidden="true">
          <span className="ring r1" /><span className="ring r2" /><span className="ring r3" />
        </div>

        <button className="orb" onClick={() => open("coach")} aria-label="Open coach">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M12 3v8M7.5 6.2a7 7 0 109 0" />
          </svg>
          <span className="orblab">REA</span>
        </button>
        <span className="corename cmono">SKILXZ</span>

        {NODES.map((n) => {
          const locked = !has(tier, n.need);
          return (
            <button
              key={n.k}
              className={`node${sel === n.k ? " on" : ""}${locked ? " locked" : ""}`}
              style={{ left: `${n.x}%`, top: `${(n.y / 115) * 100}%` }}
              onClick={() => tap(n)}
            >
              <span className="nl">{n.l}</span>
              <span className="ns">{locked ? "premium" : n.sub}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────  AI COACH  ─────────────────
   Calls the model directly with the athlete's own context — level, goals,
   the skill node they're stuck on, what they trained this week. Free tier
   gets a few messages a day; Pro and up are unlimited. */
const FREE_MSGS = 3;

const untilReset = (ts) => {
  const ms = ts - Date.now();
  if (ms <= 0) return "now";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  return h ? `${h}h ${m}m` : `${m}m`;
};

const SUGGESTIONS = [
  "Why am I stuck on my chest-to-bar?",
  "Build me a session for today",
  "How do I start working towards a planche?",
  "My wrists hurt in handstands",
  "Is 6 days a week too much?",
  "What should I eat before training?",
];

function buildContext({ user, tier, history, vals, splitDone }) {
  const focus = Object.entries(SEED_PROGRESS)
    .filter(([, v]) => v && typeof v === "object")
    .map(([id, v]) => {
      const sk = SKILLS[id];
      return sk ? `${sk.n} (${v.have}/${v.need} toward ${sk.req})` : null;
    })
    .filter(Boolean);
  const recent = history.slice(0, 4).map((h) => `${h.t} (${h.cat}, ${h.min} min)`).join("; ");
  const goals = Array.isArray(user.goal) ? user.goal.join(", ") : user.goal;
  const age = user.age ?? 25;

  return `You are the Skilxz coach — a calisthenics coach built into a bodyweight training app. You are speaking to one athlete inside their app.

ATHLETE
Name: ${user.name}
Age: ${age}
Self-reported level: ${user.lvl}
Goals: ${goals}
Why they train (their own words at signup): ${user.why || "not given"}
Plan: ${planName(tier)}
Skill steps in progress: ${focus.length ? focus.join(" | ") : "none logged"}
Recent sessions: ${recent || "none logged yet"}
6-day split: ${splitDone.length} of 6 done this week
Assessment: ${TESTS.map((t) => `${t.l} ${vals[t.k]}${t.u === "sec" ? "s" : " reps"}`).join(", ")}

HOW TO ANSWER
- Be concise. Under 150 words unless they ask for a full programme.
- Be concrete: give sets, reps, holds and a timeframe. Never vague encouragement.
- Reference their actual numbers above when relevant — that is why you have them.
- If they sound discouraged or are talking about quitting, anchor back to why they said they train. Do it once, lightly. Never repeat it back to them like a slogan.
- Plain prose. No headers or bullet lists unless they ask for a plan.
- British English. Warm but direct, like a coach at the bar, not a chatbot.

LIMITS
- You are not a doctor. If they describe pain, injury, numbness or anything that sounds medical, say briefly what to stop doing and tell them to see a physio or doctor. Do not diagnose.
- ${age < 16 ? "This athlete is under 16. Never give calorie targets, macro numbers, weight-loss advice or any diet plan. Redirect to eating enough to support training, and suggest they talk to a parent or a doctor about nutrition." : "Give nutrition guidance in ranges, never as a strict prescription."}
- Never suggest training through sharp pain, or cutting weight.`;
}

function Coach({ close, user, tier, history, vals, splitDone, toMembership, aiUsed, bumpAi, aiReset }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);
  const endRef = useRef(null);

  const unlimited = has(tier, "pro");
  const left = Math.max(FREE_MSGS - aiUsed, 0);
  const capped = !unlimited && left <= 0;

  useEffect(() => { endRef.current && endRef.current.scrollIntoView({ behavior: "smooth" }); }, [msgs, busy]);

  const send = async (q) => {
    const body = (q || text).trim();
    if (!body || busy || capped) return;
    setText("");
    setErr(null);
    const next = [...msgs, { role: "user", content: body }];
    setMsgs(next);
    if (!unlimited) bumpAi();
    setBusy(true);
    try {
      const r = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-5",
          max_tokens: 1000,
          system: buildContext({ user, tier, history, vals, splitDone }),
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!r.ok) throw new Error("bad response");
      const data = await r.json();
      const out = (data.content || []).filter((c) => c.type === "text").map((c) => c.text).join("\n").trim();
      setMsgs((m) => [...m, { role: "assistant", content: out || "I didn't catch that — try asking again." }]);
    } catch {
      setErr("Couldn't reach the coach. Check your connection and try again.");
      setMsgs((m) => m.slice(0, -1));
      setText(body);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="player coach">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close coach">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">Coach</div>
        <span className="eyebrow dim">{unlimited ? "Unlimited" : `${left} left`}</span>
      </div>

      <div className="chat">
        {msgs.length === 0 && (
          <div className="chatintro">
            <span className="coachmark"><Mark size={34} /></span>
            <h2 className="disp authh" style={{ fontSize: 25, margin: "16px 0 6px" }}>Ask me anything</h2>
            <p className="meta">
              I can see your assessment, your skill progress and what you've trained this week. Ask like you'd ask
              a coach standing next to you.
            </p>
            <div className="chips" style={{ marginTop: 20 }}>
              {SUGGESTIONS.map((q) => (
                <button key={q} className="chip sm" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          </div>
        )}

        {msgs.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>{m.content}</div>
        ))}

        {busy && (
          <div className="bubble assistant thinking">
            <span className="dotpulse" /><span className="dotpulse" /><span className="dotpulse" />
          </div>
        )}
        {err && <p className="fine warn" style={{ textAlign: "left" }}>{err}</p>}
        <div ref={endRef} />
      </div>

      {capped ? (
        <div className="chatfoot">
          <p className="fine" style={{ textAlign: "left", margin: "0 0 10px" }}>
            That's your {FREE_MSGS} free questions used. {left === 0 && `Another ${FREE_MSGS} in ${untilReset(aiReset)}.`} Pro and
            above get unlimited coaching, any time.
          </p>
          <button className="btn primary" onClick={() => { close(); toMembership(); }}>Open Membership</button>
        </div>
      ) : (
        <div className="chatfoot">
          <div className="chatbar">
            <input
              className="chatinput"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask your coach…"
              aria-label="Message the coach"
              disabled={busy}
            />
            <button className="sendbtn" onClick={() => send()} disabled={busy || !text.trim()} aria-label="Send">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10h13M11 5l5 5-5 5" /></svg>
            </button>
          </div>
          <p className="fine" style={{ margin: "9px 0 0" }}>
            {unlimited
              ? "Training guidance only. For pain, injury or medical questions, see a professional."
              : `${left} question${left === 1 ? "" : "s"} left · resets in ${untilReset(aiReset)}. Training guidance only — see a professional for anything medical.`}
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────  MUSIC  ─────────────────
   Plays the athlete's own files. Streaming catalogues need each service's
   official SDK and the listener's own subscription, so those are links out. */
const SERVICES = [
  { n: "Spotify", u: "https://open.spotify.com/search/workout" },
  { n: "Apple Music", u: "https://music.apple.com/browse" },
  { n: "YouTube Music", u: "https://music.youtube.com" },
];

function Music({ close, tracks, setTracks, ti, setTi, playing, setPlaying, vol, setVol, skip }) {
  const add = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const added = files.map((f) => ({
      id: `${f.name}-${f.size}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name.replace(/\.[^.]+$/, ""),
      url: URL.createObjectURL(f),
    }));
    setTracks((t) => [...t, ...added]);
    e.target.value = "";
  };

  const remove = (id) => {
    setTracks((t) => {
      const gone = t.find((x) => x.id === id);
      if (gone) URL.revokeObjectURL(gone.url);
      const left = t.filter((x) => x.id !== id);
      if (!left.length) setPlaying(false);
      setTi((i) => Math.min(i, Math.max(left.length - 1, 0)));
      return left;
    });
  };

  const now = tracks[ti];

  return (
    <div className="player">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close music">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">Music</div>
        <span style={{ width: 32 }} />
      </div>

      <div className="planscroll">
        <section className="card" style={{ textAlign: "center" }}>
          <span className="eyebrow">{tracks.length ? "Now playing" : "Nothing loaded"}</span>
          <div className="disp nowtitle">{now ? now.name : "Add your tracks"}</div>
          <p className="meta">{tracks.length ? `${ti + 1} of ${tracks.length}` : "Anything on your device — MP3, M4A, WAV"}</p>

          <div className="transport">
            <button onClick={() => skip(-1)} disabled={!tracks.length} aria-label="Previous track">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4h2v12H6zM16 4l-8 6 8 6z" /></svg>
            </button>
            <button className="playbig" onClick={() => setPlaying(!playing)} disabled={!tracks.length} aria-label={playing ? "Pause" : "Play"}>
              {playing
                ? <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4h3v12H6zM11 4h3v12h-3z" /></svg>
                : <svg viewBox="0 0 20 20" fill="currentColor"><path d="M6 4l10 6-10 6z" /></svg>}
            </button>
            <button onClick={() => skip(1)} disabled={!tracks.length} aria-label="Next track">
              <svg viewBox="0 0 20 20" fill="currentColor"><path d="M12 4h2v12h-2zM4 4l8 6-8 6z" /></svg>
            </button>
          </div>

          <div className="volrow">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M4 8h3l4-3v10l-4-3H4z" /></svg>
            <input type="range" min="0" max="1" step="0.02" value={vol}
              onChange={(e) => setVol(parseFloat(e.target.value))} aria-label="Volume" className="vol" />
            <span className="micro dim">{Math.round(vol * 100)}</span>
          </div>
          <p className="fine" style={{ marginTop: 12 }}>Music drops to a quarter volume while the coach speaks, then comes back up.</p>
        </section>

        <Head l="Your tracks" r={`${tracks.length}`} />
        <section className="card">
          {tracks.length === 0 ? (
            <div className="empty" style={{ border: "none", padding: "6px 0 14px" }}>
              Nothing added yet. Load a few tracks and they'll play through your session.
            </div>
          ) : (
            tracks.map((t, i) => (
              <div className={`prrow trow${i === ti ? " on" : ""}`} key={t.id}>
                <button className="trowmain" onClick={() => { setTi(i); setPlaying(true); }}>
                  <span className="tnum">{i === ti && playing ? <span className="eqbars"><i /><i /><i /></span> : String(i + 1).padStart(2, "0")}</span>
                  <span className="rn">{t.name}</span>
                </button>
                <button className="xbtn" onClick={() => remove(t.id)} aria-label={`Remove ${t.name}`}>
                  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
                </button>
              </div>
            ))
          )}
          <label className="btn outline addtracks">
            <input type="file" accept="audio/*" multiple onChange={add} />
            Add tracks from device
          </label>
        </section>

        <Head l="Or use your own app" />
        <section className="card">
          <p className="pdesc" style={{ marginTop: 0 }}>
            Start a playlist in your streaming app and it keeps playing over Skilxz. The coach still ducks it.
          </p>
          <div className="social" style={{ marginTop: 14 }}>
            {SERVICES.map((x) => (
              <a key={x.n} className="soc" href={x.u} target="_blank" rel="noopener noreferrer">
                <span className="socp">Open</span>
                <span className="soch">{x.n}</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

/* ─────────────────  OFFLINE GAME  ─────────────────
   Rep Rush: the needle sweeps the bar, you lock a rep when it's in the
   zone. The zone narrows and the sweep speeds up as you go. */
function RepRush({ close, best, setBest }) {
  const [phase, setPhase] = useState("ready");
  const [score, setScore] = useState(0);
  const [strikes, setStrikes] = useState(0);
  const [pos, setPos] = useState(0);
  const [zone, setZone] = useState({ c: 0.5, w: 0.13 });
  const [flash, setFlash] = useState(null);

  const dir = useRef(1);
  const speed = useRef(0.75);
  const posRef = useRef(0);
  const raf = useRef(null);
  const last = useRef(0);
  const live = useRef(false);

  const newZone = (n) => {
    const w = Math.max(0.135 - n * 0.006, 0.045);
    setZone({ c: 0.16 + Math.random() * 0.68, w });
  };

  const start = () => {
    setScore(0); setStrikes(0); setFlash(null);
    speed.current = 0.75; posRef.current = 0; dir.current = 1;
    setPos(0); newZone(0); setPhase("playing"); live.current = true;
    last.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const tick = (t) => {
    if (!live.current) return;
    const dt = Math.min((t - last.current) / 1000, 0.05);
    last.current = t;
    let p = posRef.current + dir.current * speed.current * dt;
    if (p >= 1) { p = 1; dir.current = -1; }
    if (p <= 0) { p = 0; dir.current = 1; }
    posRef.current = p;
    setPos(p);
    raf.current = requestAnimationFrame(tick);
  };

  const stop = () => { live.current = false; if (raf.current) cancelAnimationFrame(raf.current); };
  useEffect(() => stop, []);

  const lock = () => {
    if (phase === "ready" || phase === "over") { start(); return; }
    const d = Math.abs(posRef.current - zone.c);
    if (d <= zone.w * 0.34) {
      const n = score + 2;
      setScore(n); setFlash("PERFECT"); speed.current += 0.07; newZone(n);
    } else if (d <= zone.w) {
      const n = score + 1;
      setScore(n); setFlash("GOOD"); speed.current += 0.05; newZone(n);
    } else {
      const st = strikes + 1;
      setStrikes(st); setFlash("MISS");
      if (st >= 3) {
        stop(); setPhase("over");
        if (score > best) setBest(score);
        return;
      }
      newZone(score);
    }
    setTimeout(() => setFlash(null), 380);
  };

  useEffect(() => {
    const k = (e) => { if (e.code === "Space" || e.code === "Enter") { e.preventDefault(); lock(); } };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  });

  return (
    <div className="player game">
      <div className="phead">
        <button className="close" onClick={() => { stop(); close(); }} aria-label="Close game">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">Rep Rush</div>
        <span className="eyebrow dim">Best {best}</span>
      </div>

      <div className="gamebody" onPointerDown={lock} role="button" tabIndex={0} aria-label="Lock a rep">
        <div className="gscore">
          <b className="disp">{score}</b>
          <span className="eyebrow dim">reps</span>
        </div>

        <div className="strikes">
          {[0, 1, 2].map((n) => <span key={n} className={`strike${n < strikes ? " out" : ""}`} />)}
        </div>

        <div className="gbar">
          <span className="gzone" style={{ left: `${(zone.c - zone.w) * 100}%`, width: `${zone.w * 200}%` }} />
          <span className="gcore" style={{ left: `${(zone.c - zone.w * 0.34) * 100}%`, width: `${zone.w * 0.68 * 100}%` }} />
          <span className="gneedle" style={{ left: `${pos * 100}%` }} />
        </div>

        {flash && <div className={`gflash ${flash.toLowerCase()}`}>{flash}</div>}

        {phase === "ready" && (
          <div className="goverlay">
            <h2 className="disp authh" style={{ fontSize: 27 }}>Rep Rush</h2>
            <p className="cue">Tap when the needle is inside the bright zone. Three misses and the set's over.</p>
            <button className="btn primary" style={{ maxWidth: 260, marginTop: 18 }} onClick={start}>Start</button>
          </div>
        )}

        {phase === "over" && (
          <div className="goverlay">
            <span className="eyebrow">Set over</span>
            <h2 className="disp" style={{ fontSize: 52, margin: "10px 0 4px" }}>{score}</h2>
            <p className="cue">{score >= best && score > 0 ? "New best. That's your record." : `Best so far: ${best}`}</p>
            <button className="btn primary" style={{ maxWidth: 260, marginTop: 18 }} onClick={start}>Go again</button>
            <button className="peek" onClick={() => { stop(); close(); }}>Back to training</button>
          </div>
        )}
      </div>

      <p className="fine" style={{ paddingBottom: 26 }}>Tap anywhere, or press space.</p>
    </div>
  );
}

/* ─────────────────  OFFLINE MINI GAME  ─────────────────
   Bar Work: a marker sweeps the bar, tap inside the grip zone to bank a rep.
   The zone narrows and the sweep quickens as the set goes on. Three misses out. */
function BarWork({ close, best, setBest }) {
  const [phase, setPhase] = useState("ready");
  const [pos, setPos] = useState(0.5);
  const [zone, setZone] = useState({ c: 0.5, w: 0.22 });
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [lives, setLives] = useState(3);
  const [flash, setFlash] = useState(null);

  const raf = useRef(0);
  const state = useRef({ pos: 0.5, dir: 1, speed: 0.45, last: 0 });
  const live = useRef({ zone, lives, score, combo, phase });
  live.current = { zone, lives, score, combo, phase };

  const newZone = (tighter) =>
    setZone((z) => {
      const w = Math.max(0.07, Math.min(0.26, tighter ? z.w * 0.94 : z.w * 1.08));
      const c = w / 2 + Math.random() * (1 - w);
      return { c, w };
    });

  const start = () => {
    setScore(0); setCombo(0); setLives(3);
    setZone({ c: 0.5, w: 0.22 });
    state.current = { pos: 0.5, dir: 1, speed: 0.45, last: 0 };
    setPhase("play");
  };

  useEffect(() => {
    if (phase !== "play") return;
    const step = (t) => {
      const st = state.current;
      if (!st.last) st.last = t;
      const dt = Math.min((t - st.last) / 1000, 0.05);
      st.last = t;
      st.pos += st.dir * st.speed * dt;
      if (st.pos >= 1) { st.pos = 1; st.dir = -1; }
      if (st.pos <= 0) { st.pos = 0; st.dir = 1; }
      setPos(st.pos);
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [phase]);

  const tap = () => {
    if (phase === "ready" || phase === "over") { start(); return; }
    const { zone: z } = live.current;
    const hit = Math.abs(state.current.pos - z.c) <= z.w / 2;
    if (hit) {
      const c = live.current.combo + 1;
      setCombo(c);
      setScore((v) => v + 1 + Math.floor(c / 5));
      setFlash("hit");
      state.current.speed = Math.min(state.current.speed + 0.045, 1.7);
      newZone(true);
    } else {
      const l = live.current.lives - 1;
      setLives(l);
      setCombo(0);
      setFlash("miss");
      state.current.speed = Math.max(state.current.speed - 0.06, 0.4);
      newZone(false);
      if (l <= 0) {
        setPhase("over");
        setBest((b) => Math.max(b, live.current.score));
      }
    }
    setTimeout(() => setFlash(null), 200);
  };

  useEffect(() => {
    const key = (e) => { if (e.code === "Space" || e.key === " ") { e.preventDefault(); tap(); } };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  return (
    <div className="player game">
      <div className="phead">
        <button className="close" onClick={close} aria-label="Close game">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
        </button>
        <div className="eyebrow">Bar Work</div>
        <span className="eyebrow dim">Best {best}</span>
      </div>

      <div className="gamebody" onClick={tap} role="button" tabIndex={0}
           onKeyDown={(e) => e.key === "Enter" && tap()} aria-label="Tap to bank a rep">
        <div className="gscore">
          <div className="disp gnum">{score}</div>
          <span className="eyebrow dim">{combo > 2 ? `${combo} in a row` : "reps"}</span>
        </div>

        <div className={`gbar${flash ? " " + flash : ""}`}>
          <span className="gzone" style={{ left: `${(zone.c - zone.w / 2) * 100}%`, width: `${zone.w * 100}%` }} />
          <span className="gmark" style={{ left: `${pos * 100}%` }} />
        </div>

        <div className="glives">
          {[0, 1, 2].map((k) => <span key={k} className={`glife${k < lives ? " on" : ""}`} />)}
        </div>

        {phase === "ready" && (
          <div className="gover">
            <h2 className="disp authh" style={{ fontSize: 27 }}>Bar Work</h2>
            <p className="meta" style={{ maxWidth: 260, margin: "8px auto 0" }}>
              Tap when the marker is inside the grip zone. It narrows every rep you bank.
              Three misses and you're off the bar.
            </p>
            <button className="btn primary" style={{ maxWidth: 240, margin: "22px auto 0" }}>Start set</button>
          </div>
        )}

        {phase === "over" && (
          <div className="gover">
            <span className="eyebrow">Set over</span>
            <div className="disp gnum big">{score}</div>
            <p className="meta">
              {score > best ? "New best — that's your record." : `${best - score} off your best of ${best}.`}
            </p>
            <button className="btn primary" style={{ maxWidth: 240, margin: "22px auto 0" }}>Go again</button>
          </div>
        )}
      </div>

      <p className="fine" style={{ paddingBottom: 26 }}>Works with no connection. Tap anywhere, or press space.</p>
    </div>
  );
}

function Sheet({ data, close, play, openEx }) {
  return (
    <div className="scrim" onClick={close}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <div className="grab" />
        <span className="tag">{data.cat}</span>
        <div className="disp sheettitle">{data.t}</div>
        <p className="meta">{data.lvl} · {data.min} min · {data.eq}</p>
        <p className="pdesc">{data.d}</p>
        <div>
          {data.ex.map((x, i) => (
            <div className="row" key={`${i}-${x.n}`}>
              <span className="ix">{String(i + 1).padStart(2, "0")}</span>
              <div className="rn">{x.n}</div>
              <span className="rs">{x.s}</span>
            </div>
          ))}
        </div>
        <button className="btn primary" onClick={() => { close(); play(data); }}>Start workout</button>
      </div>
    </div>
  );
}

/* ─────────────────  PLAYER  ───────────────── */

/* ─────────────────  VOICE COACH  ─────────────────
   Uses the browser's built-in speech engines: speechSynthesis to talk,
   SpeechRecognition to listen. Both are feature-detected — if either is
   missing the player behaves exactly as it did before. */
const canSpeak = () => typeof window !== "undefined" && "speechSynthesis" in window;
const Recog = () =>
  typeof window !== "undefined" ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

/* The voice coach ducks the music instead of shouting over it. */
const duck = { fn: null };

function say(text, { rate = 1.04, pitch = 1, cut = false } = {}) {
  if (!canSpeak()) return;
  try {
    if (cut) window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = rate;
    u.pitch = pitch;
    u.lang = "en-GB";
    u.onstart = () => duck.fn && duck.fn(true);
    u.onend = () => duck.fn && duck.fn(false);
    u.onerror = () => duck.fn && duck.fn(false);
    window.speechSynthesis.speak(u);
  } catch {}
}

const COMMANDS = [
  { k: "next", re: /\b(next|done|complete|completed|finished|got it)\b/, l: "\"Next\" / \"Done\"", d: "Complete the set" },
  { k: "skip", re: /\bskip\b/, l: "\"Skip\"", d: "Move past this exercise" },
  { k: "back", re: /\b(back|previous|go back)\b/, l: "\"Back\"", d: "Return one set" },
  { k: "pause", re: /\b(pause|hold|wait|stop the clock)\b/, l: "\"Pause\"", d: "Freeze the rest timer" },
  { k: "resume", re: /\b(resume|continue|carry on|go)\b/, l: "\"Resume\"", d: "Start it again" },
  { k: "more", re: /\b(more time|add thirty|extra rest|more rest)\b/, l: "\"More time\"", d: "Add 30 seconds" },
  { k: "status", re: /\b(how long|how much|time left|remaining)\b/, l: "\"How long?\"", d: "Read the timer out" },
  { k: "repeat", re: /\b(repeat|say again|what was that|what now)\b/, l: "\"Repeat\"", d: "Say the exercise again" },
  { k: "end", re: /\b(end workout|stop workout|finish workout)\b/, l: "\"End workout\"", d: "Finish and log" },
];

function parseSet(s) {
  const [a, b] = s.split("×").map((x) => x.trim());
  return { sets: parseInt(a, 10) || 1, target: b || "" };
}

function Player({ w, close, finish, openEx, openMusic }) {
  const [i, setI] = useState(0);
  const [set, setSet] = useState(1);
  const [rest, setRest] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [voice, setVoice] = useState(false);
  const [paused, setPaused] = useState(false);
  const [heard, setHeard] = useState("");
  const [micOk, setMicOk] = useState(true);
  const [help, setHelp] = useState(false);
  const act = useRef({});
  const recog = useRef(null);
  const spoken = useRef(-1);
  const ex = w.ex[i];
  const { sets, target } = parseSet(ex.s);
  const info = EX.find((e) => e.n.toLowerCase() === ex.n.toLowerCase().replace("strict ", ""));
  const totalSets = w.ex.reduce((a, x) => a + parseSet(x.s).sets, 0);
  const doneSets = w.ex.slice(0, i).reduce((a, x) => a + parseSet(x.s).sets, 0) + (set - 1);

  useEffect(() => {
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    if (rest <= 0 || paused) return;
    const t = setInterval(() => setRest((r) => Math.max(r - 1, 0)), 1000);
    return () => clearInterval(t);
  }, [rest, paused]);

  const next = () => {
    if (set < sets) { setSet((s) => s + 1); setRest(60); }
    else if (i < w.ex.length - 1) { setI((x) => x + 1); setSet(1); setRest(90); }
    else finish(w);
  };

  const clock = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const spoke = (n) => (n.includes("×") ? n : n);

  const cue = () => {
    const t = target === "max" ? "as many as you can" : target.includes("s") ? `${parseInt(target, 10)} seconds` : `${target} reps`;
    say(`${ex.n}. Set ${set} of ${sets}. ${t}.`, { cut: true });
  };

  // Announce each new set once, and only in hands-free mode.
  useEffect(() => {
    if (!voice) return;
    const id = i * 100 + set;
    if (spoken.current === id || rest > 0) return;
    spoken.current = id;
    cue();
  }, [voice, i, set, rest]);

  // Countdown out loud so nobody has to look at the screen.
  useEffect(() => {
    if (!voice || paused) return;
    if (rest === 10) say("Ten seconds.");
    if (rest === 3) say("Three.");
    if (rest === 2) say("Two.");
    if (rest === 1) say("One.");
  }, [rest, voice, paused]);

  act.current = {
    next: () => next(),
    skip: () => { if (i < w.ex.length - 1) { setI(i + 1); setSet(1); setRest(0); } else finish(w); },
    back: () => { if (set > 1) setSet(set - 1); else if (i > 0) { setI(i - 1); setSet(1); } setRest(0); },
    pause: () => { setPaused(true); say("Paused."); },
    resume: () => { setPaused(false); say("Go."); },
    more: () => { setRest((r) => r + 30); say("Thirty seconds added."); },
    status: () => say(rest > 0 ? `${rest} seconds of rest left.` : `${ex.n}, set ${set} of ${sets}.`, { cut: true }),
    repeat: () => cue(),
    end: () => finish(w),
  };

  // Listen only while hands-free is on; always tear the mic down after.
  useEffect(() => {
    const R = Recog();
    if (!voice || !R) return;
    let stopped = false;
    let r;
    try {
      r = new R();
      r.continuous = true;
      r.interimResults = false;
      r.lang = "en-GB";
      r.onresult = (e) => {
        const t = String(e.results[e.results.length - 1][0].transcript || "").toLowerCase().trim();
        setHeard(t);
        const hit = COMMANDS.find((c) => c.re.test(t));
        if (hit && act.current[hit.k]) act.current[hit.k]();
      };
      r.onerror = (e) => { if (e.error === "not-allowed" || e.error === "service-not-allowed") { setMicOk(false); setVoice(false); } };
      r.onend = () => { if (!stopped) { try { r.start(); } catch {} } };
      r.start();
      recog.current = r;
    } catch { setMicOk(false); }
    return () => {
      stopped = true;
      try { r && r.stop(); } catch {}
      recog.current = null;
    };
  }, [voice]);

  useEffect(() => () => { try { window.speechSynthesis.cancel(); } catch {} }, []);

  const toggleVoice = () => {
    const on = !voice;
    setVoice(on);
    if (on) { say("Hands free on. Say next when you finish a set.", { cut: true }); setHelp(true); setTimeout(() => setHelp(false), 6000); }
    else { try { window.speechSynthesis.cancel(); } catch {} }
  };

  return (
    <div className="player">
      <div className="pbar"><i style={{ width: `${(doneSets / totalSets) * 100}%` }} /></div>
      <div className="phead">
        <button className="close" onClick={close} aria-label="End workout">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M3 3l10 10M13 3L3 13" />
          </svg>
        </button>
        <div className="eyebrow">{w.t}</div>
        <div className="phright">
          <button className="voicebtn" onClick={openMusic} aria-label="Music">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 15.5V5l9-1.6v10.2" /><circle cx="5" cy="15.5" r="2.2" /><circle cx="14" cy="13.6" r="2.2" />
            </svg>
          </button>
          <button className={`voicebtn${voice ? " on" : ""}`} onClick={toggleVoice} aria-pressed={voice} aria-label="Hands-free mode">
            <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 3a2.4 2.4 0 012.4 2.4v4.2a2.4 2.4 0 11-4.8 0V5.4A2.4 2.4 0 0110 3zM5 9.4a5 5 0 0010 0M10 14.4V17" />
            </svg>
          </button>
          <div className="eyebrow">{clock(elapsed)}</div>
        </div>
      </div>

      {voice && (
        <div className="voicebar">
          <span className="miclive" />
          <span className="voicetxt">{heard ? `“${heard}”` : paused ? "Paused — say “resume”" : "Listening — say “next” when you finish"}</span>
          <button className="voicehelp" onClick={() => setHelp(!help)}>{help ? "Hide" : "Commands"}</button>
        </div>
      )}
      {voice && help && (
        <div className="cmdlist">
          {COMMANDS.map((c) => (
            <div className="cmdrow" key={c.k}><span className="cmdl">{c.l}</span><span className="cmdd">{c.d}</span></div>
          ))}
        </div>
      )}
      {!micOk && (
        <div className="voicebar warn">
          <span className="voicetxt">Microphone blocked. Voice cues still work — allow mic access for commands.</span>
        </div>
      )}

      {rest > 0 ? (
        <div className="pbody">
          <div className="eyebrow">Rest</div>
          <div className="disp restnum">{clock(rest)}</div>
          <p className="meta" style={{ marginBottom: 30 }}>
            Up next · {ex.n} {set > 1 || i > 0 ? `· set ${set} of ${sets}` : ""}
          </p>
          <div className="btnrow" style={{ width: "100%" }}>
            <button className="btn ghost" onClick={() => setRest((r) => r + 30)}>+30s</button>
            <button className="btn ghost" onClick={() => setPaused(!paused)}>{paused ? "Resume" : "Pause"}</button>
            <button className="btn ghost" onClick={() => setRest(0)}>Skip rest</button>
          </div>
        </div>
      ) : (
        <div className="pbody">
          <div className="eyebrow">Exercise {i + 1} of {w.ex.length}</div>
          <button className="exnamebtn" onClick={() => { const f = findEx(ex.n); if (f) openEx(f); }}>
            <h2 className="disp exname">{ex.n}</h2>
            {findEx(ex.n) && <span className="howto">How to do it</span>}
          </button>
          <Demo name={ex.n} />
          <div className="setline">
            <span className="disp bignum">{target}</span>
            <span className="meta">set {set} of {sets}</span>
          </div>
          {info && <p className="cue">{info.note}</p>}
          <button className="btn primary" onClick={next} style={{ marginTop: 26 }}>
            {i === w.ex.length - 1 && set === sets ? "Finish workout" : "Complete set"}
          </button>
          <div className="btnrow">
            <button className="btn ghost" onClick={() => { if (set > 1) setSet(set - 1); else if (i > 0) { setI(i - 1); setSet(1); } }} disabled={i === 0 && set === 1}>Back</button>
            <button className="btn ghost" onClick={() => { if (i < w.ex.length - 1) { setI(i + 1); setSet(1); } else finish(w); }}>Skip exercise</button>
          </div>
        </div>
      )}

      <div className="upnext">
        {w.ex.map((x, k) => (
          <span key={x.n} className={`unode${k < i ? " done" : k === i ? " now" : ""}`} title={x.n} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────  CSS  ───────────────────────── */

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@75..125,400..900&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500;600&display=swap');

.skx{--void:#000000;--slab:#0C0C0E;--slab2:#141417;--iron:#252529;
  --chalk:#D7D7DC;--dust:#6E6E77;--neon:#FFFFFF;--deep:rgba(255,255,255,.09);
  --glow:0 0 14px rgba(255,255,255,.42);--glowsm:0 0 8px rgba(255,255,255,.34);
  background:var(--void);min-height:100vh;width:100%;display:flex;justify-content:center;
  font-family:'Inter',system-ui,sans-serif;color:var(--chalk);-webkit-font-smoothing:antialiased;}
.skx *,.skx *::before,.skx *::after{box-sizing:border-box;}
.skx button{font-family:inherit;color:inherit;background:none;border:none;cursor:pointer;text-align:left;}
.skx button:focus-visible{outline:2px solid var(--neon);outline-offset:3px;border-radius:6px;}
.phone{width:100%;max-width:428px;padding:0 20px 0;position:relative;}
main{padding-bottom:26px;}

.rise{opacity:0;transform:translateY(14px);transition:opacity .5s ease,transform .5s cubic-bezier(.2,.7,.3,1);}
.skx.on .rise{opacity:1;transform:none;}
.d1{transition-delay:.04s}.d2{transition-delay:.10s}.d3{transition-delay:.16s}
.d4{transition-delay:.22s}.d5{transition-delay:.28s}.d6{transition-delay:.34s}

.eyebrow{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:10px;
  letter-spacing:.16em;text-transform:uppercase;color:var(--dust);}
.disp{font-family:'Archivo';font-variation-settings:'wdth' 118,'wght' 800;letter-spacing:-.015em;line-height:.95;}

.top{display:flex;align-items:center;justify-content:space-between;padding:26px 0 20px;}
.mark{font-family:'Archivo';font-variation-settings:'wdth' 125,'wght' 800;font-size:19px;
  letter-spacing:.02em;text-transform:uppercase;}
.mark span{color:var(--neon);}
.lvl{display:flex;align-items:center;gap:9px;}
.lvlnum{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;font-size:11px;
  border:1px solid var(--iron);border-radius:999px;padding:5px 11px;letter-spacing:.06em;
  display:flex;align-items:center;gap:7px;}
.lvlbar{width:26px;height:3px;background:var(--iron);border-radius:99px;overflow:hidden;display:block;}
.lvlbar i{display:block;height:100%;background:var(--neon);}
.av{width:34px;height:34px;border-radius:999px;background:var(--slab2);border:1px solid var(--iron);
  font-family:'Archivo';font-variation-settings:'wght' 800;font-size:12px;display:grid;place-items:center;}

.streak{display:flex;align-items:center;justify-content:space-between;border-top:1px solid var(--iron);
  border-bottom:1px solid var(--iron);padding:14px 0;margin-bottom:24px;}
.stnum{display:flex;align-items:baseline;gap:8px;}
.stnum b{font-family:'Archivo';font-variation-settings:'wdth' 118,'wght' 800;font-size:30px;line-height:1;color:var(--neon);}
.dots{display:flex;gap:5px;}
.dot{width:7px;height:7px;border-radius:2px;background:var(--iron);}
.dot.hit{background:var(--neon);}
.dot.now{background:transparent;border:1px solid var(--neon);}

.head{display:flex;align-items:center;justify-content:space-between;margin:0 0 10px;}

.card{background:var(--slab);border:1px solid var(--iron);border-radius:18px;padding:20px;margin-bottom:24px;
  transition:border-color .3s ease;}
.card.lit{border-color:var(--neon);}
.herotop{display:flex;justify-content:space-between;align-items:flex-start;gap:16px;}
.tag{display:inline-block;font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 700;font-size:10px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--neon);background:var(--deep);
  padding:4px 8px;border-radius:5px;margin-bottom:11px;}
.herotitle{font-size:29px;margin-bottom:9px;}
.meta{font-size:13px;color:var(--dust);}
.ringwrap{position:relative;flex-shrink:0;}
.ringtxt{position:absolute;inset:0;display:grid;place-items:center;text-align:center;line-height:1.15;}
.ringtxt b{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;font-size:15px;display:block;}
.ringtxt i{font-style:normal;font-size:9px;color:var(--dust);letter-spacing:.08em;text-transform:uppercase;}

.btn{border-radius:11px;padding:14px;font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;
  font-size:13.5px;letter-spacing:.06em;text-transform:uppercase;text-align:center;
  transition:transform .1s ease,background .15s ease,border-color .15s ease;display:block;width:100%;}
.btn:active{transform:scale(.985);}
.btn.primary{background:var(--chalk);color:var(--void);margin-top:18px;}
.btn.ghost{border:1px solid var(--iron);flex:1;padding:12px 0;font-size:12.5px;}
.btn.ghost:hover{background:var(--slab2);border-color:var(--dust);}
.btn.outline{border:1px solid var(--chalk);margin-top:14px;}
.btnrow{display:flex;gap:8px;margin-top:16px;}

.peek{width:100%;margin-top:11px;font-size:12.5px;color:var(--dust);padding:4px;
  display:flex;align-items:center;justify-content:center;gap:6px;}
.chev{transition:transform .25s ease;}
.chev.up{transform:rotate(180deg);}
.collapse{overflow:hidden;max-height:0;transition:max-height .35s cubic-bezier(.3,.8,.3,1);}
.collapse.open{max-height:620px;}

.row{display:flex;align-items:baseline;gap:12px;padding:11px 0;border-bottom:1px solid var(--iron);}
.row:last-child{border-bottom:none;}
.ix{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:10px;color:var(--dust);width:16px;flex-shrink:0;letter-spacing:.06em;}
.rn{font-size:14px;font-weight:500;}
.rnote{font-size:11.5px;color:var(--dust);margin-top:2px;}
.rs{margin-left:auto;font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:13px;white-space:nowrap;}

.track{display:flex;align-items:center;margin:6px 0 20px;}
.seg{flex:1;height:2px;background:var(--iron);}
.seg.filled{background:var(--chalk);}
.seg.dash{background:none;border-top:2px dotted var(--iron);height:0;}
.nd{width:28px;height:28px;border-radius:999px;flex-shrink:0;display:grid;place-items:center;
  border:2px solid var(--iron);background:var(--slab);transition:all .2s ease;position:relative;padding:0;}
.nd.done{background:var(--chalk);border-color:var(--chalk);}
.nd.now{border-color:var(--neon);background:var(--deep);}
.nd.sel{transform:scale(1.22);}
.nd.sel::after{content:"";position:absolute;inset:-7px;border-radius:999px;border:1px solid var(--dust);}
.tick{width:10px;height:10px;}
.pip{width:9px;height:9px;border-radius:999px;background:var(--neon);}
.lockdot{width:6px;height:6px;border-radius:999px;background:var(--iron);}

.detail{border-top:1px solid var(--iron);padding-top:16px;}
.dname{font-family:'Archivo';font-variation-settings:'wdth' 115,'wght' 800;font-size:21px;margin-bottom:5px;}
.dreq{font-size:13px;color:var(--dust);}
.bar{height:5px;background:var(--iron);border-radius:99px;margin-top:14px;overflow:hidden;}
.bar i{display:block;height:100%;background:var(--neon);border-radius:99px;transition:width .6s cubic-bezier(.2,.8,.2,1);}
.barlab{display:flex;justify-content:space-between;margin-top:8px;font-size:12px;color:var(--dust);}
.barlab b{color:var(--chalk);font-family:'Archivo';font-variation-settings:'wght' 700;}

.cbig{font-size:40px;}
.cbig em{font-style:normal;font-size:15px;color:var(--dust);font-variation-settings:'wdth' 100,'wght' 500;margin-left:3px;}
.cdone{margin-top:16px;font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 800;font-size:12.5px;
  letter-spacing:.1em;text-transform:uppercase;color:var(--neon);}

.wcard{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:var(--slab);border:1px solid var(--iron);border-radius:14px;padding:15px 16px;margin-bottom:9px;
  transition:border-color .15s ease,background .15s ease;}
.wcard:hover{border-color:var(--dust);background:var(--slab2);}
.wtitle{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:15.5px;margin-bottom:4px;}
.wmeta{font-size:12px;color:var(--dust);}
.wcat{font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:9.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--dust);border:1px solid var(--iron);border-radius:5px;padding:4px 7px;white-space:nowrap;}

.nav{position:sticky;bottom:0;margin:0 -20px;display:flex;background:rgba(10,11,13,.93);
  backdrop-filter:blur(14px);border-top:1px solid var(--iron);padding:11px 0 22px;z-index:5;}
.tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;text-align:center;
  font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:9.5px;
  letter-spacing:.1em;text-transform:uppercase;color:var(--dust);transition:color .15s ease;}
.tab.act{color:var(--chalk);}
.glyph{width:19px;height:19px;}

.toast{position:fixed;bottom:96px;left:50%;transform:translateX(-50%);background:var(--chalk);color:var(--void);
  padding:12px 18px;border-radius:11px;font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 700;
  font-size:12.5px;letter-spacing:.04em;z-index:60;animation:pop .3s cubic-bezier(.2,.9,.3,1);white-space:nowrap;}
@keyframes pop{from{opacity:0;transform:translate(-50%,14px);}to{opacity:1;transform:translate(-50%,0);}}

.btn:disabled{opacity:.3;cursor:default;transform:none;}
.screentitle{font-size:34px;margin-bottom:6px;}

.seg2{display:flex;gap:4px;background:var(--slab);border:1px solid var(--iron);border-radius:12px;
  padding:4px;margin-bottom:20px;}
.seg2 button{flex:1;text-align:center;padding:10px 0;border-radius:9px;font-family:'Archivo';
  font-variation-settings:'wdth' 110,'wght' 700;font-size:12px;letter-spacing:.08em;text-transform:uppercase;
  color:var(--dust);transition:background .18s ease,color .18s ease;}
.seg2 button.act{background:var(--chalk);color:var(--void);}

.gencard{width:100%;display:flex;align-items:flex-end;justify-content:space-between;gap:14px;
  background:linear-gradient(150deg,var(--slab2),var(--slab));border:1px solid var(--neon);
  border-radius:18px;padding:20px;margin-bottom:24px;transition:transform .12s ease;}
.gencard:active{transform:scale(.99);}
.gentitle{font-size:27px;margin-top:2px;}

.chips{display:flex;flex-wrap:wrap;gap:7px;margin-bottom:12px;}
.chip{border:1px solid var(--iron);border-radius:999px;padding:8px 13px;font-size:12.5px;color:var(--dust);
  transition:all .15s ease;white-space:nowrap;}
.chip:hover{border-color:var(--dust);color:var(--chalk);}
.chip.on{background:var(--chalk);border-color:var(--chalk);color:var(--void);font-weight:600;}
.chip.sm{font-size:11.5px;padding:6px 11px;}
.chip:disabled{opacity:.75;cursor:default;}

.empty{border:1px dashed var(--iron);border-radius:14px;padding:26px 20px;text-align:center;
  font-size:13.5px;color:var(--dust);}
.empty .btn{max-width:200px;margin:16px auto 0;}

.pcard{background:var(--slab);border:1px solid var(--iron);border-radius:16px;padding:18px;margin-bottom:11px;}
.pcard.lit{border-color:var(--neon);}
.ptop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
.pdesc{font-size:13px;color:var(--dust);line-height:1.5;margin:10px 0 0;}
.pcard .btn{margin-top:15px;}
.wcat.pro{color:var(--neon);border-color:var(--neon);}

.scrim{position:fixed;inset:0;background:rgba(5,6,7,.72);backdrop-filter:blur(3px);z-index:50;
  display:flex;align-items:flex-end;justify-content:center;animation:fade .22s ease;}
@keyframes fade{from{opacity:0}to{opacity:1}}
.sheet{width:100%;max-width:428px;background:var(--slab);border:1px solid var(--iron);border-bottom:none;
  border-radius:22px 22px 0 0;padding:12px 20px 34px;max-height:88vh;overflow-y:auto;
  animation:slide .3s cubic-bezier(.2,.9,.3,1);}
@keyframes slide{from{transform:translateY(40px)}to{transform:none}}
.grab{width:38px;height:4px;border-radius:99px;background:var(--iron);margin:0 auto 18px;}
.sheettitle{font-size:29px;margin-bottom:7px;}
.qlab{display:block;margin:20px 0 9px;}
.sheet .btn.primary{margin-top:22px;}
.sheet .btn.outline{margin-top:9px;}

.branchtop{display:flex;align-items:center;justify-content:space-between;gap:14px;margin-bottom:6px;}

.tiles{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:22px;}
.tile{background:var(--slab);border:1px solid var(--iron);border-radius:14px;padding:15px;}
.tile b{display:block;font-size:27px;margin-bottom:6px;}
.tile em{display:block;font-style:normal;font-size:11px;color:var(--dust);margin-top:3px;}

.month{display:flex;align-items:flex-end;gap:3px;height:88px;margin-top:14px;}
.mbar{flex:1;border-radius:2px;background:var(--iron);transition:height .7s cubic-bezier(.2,.8,.2,1);}
.mbar.on{background:var(--chalk);}
.split{border-top:1px solid var(--iron);margin-top:18px;padding-top:16px;}
.srow{display:flex;align-items:center;gap:11px;margin-bottom:10px;}
.sk{font-size:12.5px;width:44px;color:var(--dust);}
.sbar{flex:1;height:6px;background:var(--iron);border-radius:99px;overflow:hidden;}
.sbar i{display:block;height:100%;background:var(--neon);border-radius:99px;}
.sv{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:12px;width:32px;text-align:right;}

.prrow{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:15px 0;
  border-bottom:1px solid var(--iron);}
.prval{display:flex;align-items:baseline;gap:5px;}
.prval b{font-size:23px;}
.prval em{font-style:normal;font-size:11px;color:var(--dust);}
.up{color:var(--neon);font-size:13px;margin-left:2px;}

.profile{display:flex;align-items:center;gap:15px;margin-bottom:22px;}
.avbig{width:60px;height:60px;border-radius:999px;background:var(--slab2);border:1px solid var(--iron);
  display:grid;place-items:center;font-family:'Archivo';font-variation-settings:'wght' 800;font-size:19px;flex-shrink:0;}

.badges{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-bottom:26px;}
.badge{background:var(--slab);border:1px solid var(--iron);border-radius:13px;padding:14px;opacity:.42;}
.badge.got{opacity:1;}
.bdot{width:10px;height:10px;border-radius:3px;background:var(--iron);margin-bottom:11px;}
.badge.got .bdot{background:var(--neon);}
.bn{font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 700;font-size:13.5px;margin-bottom:3px;}
.bd{font-size:11px;color:var(--dust);line-height:1.4;}

.card.pro{border-color:var(--neon);background:linear-gradient(160deg,var(--slab2),var(--slab));}
.prolist{list-style:none;padding:0;margin:16px 0 0;}
.prolist li{font-size:13px;color:var(--dust);padding:8px 0 8px 18px;position:relative;line-height:1.4;}
.prolist li::before{content:"";position:absolute;left:0;top:15px;width:6px;height:6px;border-radius:2px;background:var(--neon);}

.player{position:fixed;inset:0;background:var(--void);z-index:70;display:flex;flex-direction:column;
  align-items:center;animation:fade .2s ease;}
.pbar{width:100%;height:3px;background:var(--iron);flex-shrink:0;}
.pbar i{display:block;height:100%;background:var(--neon);transition:width .4s ease;}
.phead{width:100%;max-width:428px;display:flex;align-items:center;justify-content:space-between;
  gap:12px;padding:18px 20px;flex-shrink:0;}
.close{width:32px;height:32px;border-radius:999px;border:1px solid var(--iron);display:grid;place-items:center;flex-shrink:0;}
.pbody{width:100%;max-width:428px;padding:10px 20px 20px;flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;overflow-y:auto;}
.pbody .eyebrow{margin-bottom:12px;}
.exname{font-size:36px;margin-bottom:22px;line-height:1;}
.restnum{font-size:76px;color:var(--neon);margin:6px 0 16px;}
.demo{width:100%;max-width:250px;aspect-ratio:16/10;background:var(--slab);border:1px solid var(--iron);
  border-radius:14px;color:var(--dust);display:grid;place-items:center;position:relative;margin-bottom:24px;padding:14px;}
.demolab{position:absolute;bottom:9px;right:11px;font-family:'Archivo';font-variation-settings:'wght' 700;
  font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--iron);}
.setline{display:flex;flex-direction:column;align-items:center;gap:5px;}
.bignum{font-size:52px;line-height:1;}
.cue{font-size:13px;color:var(--dust);margin-top:14px;max-width:280px;line-height:1.5;}
.pbody .btn.primary{max-width:320px;}
.pbody .btnrow{width:100%;max-width:320px;}
.upnext{display:flex;gap:6px;padding:0 0 30px;flex-shrink:0;}
.unode{width:26px;height:3px;border-radius:99px;background:var(--iron);}
.unode.done{background:var(--dust);}
.unode.now{background:var(--neon);}

.seg2.four button{font-size:10.5px;letter-spacing:.05em;padding:10px 2px;}

.rtop{margin-bottom:6px;}
.overall{font-size:56px;line-height:1;margin:6px 0 10px;}
.overall em{font-style:normal;font-size:15px;color:var(--dust);font-variation-settings:'wdth' 100,'wght' 500;margin-left:4px;}
.overall.sm{font-size:30px;margin:4px 0 0;}
.overall.sm em{font-size:12px;}
.overall.big{font-size:74px;margin-bottom:14px;}
.tierline{display:flex;align-items:center;gap:10px;}
.tierline .tag{margin-bottom:0;}
.delta{font-size:12px;color:var(--dust);}

.radar{width:100%;max-width:300px;display:block;margin:8px auto 0;overflow:visible;}
.rlab{font-family:'Archivo';font-size:9.5px;letter-spacing:.12em;text-transform:uppercase;
  fill:#6E6E77;font-variation-settings:'wght' 700;}
.legend{display:flex;justify-content:center;gap:18px;margin:6px 0 16px;font-size:11px;color:var(--dust);}
.legend span{display:flex;align-items:center;gap:6px;}
.sw{width:14px;height:0;border-top:2px solid var(--neon);display:block;}
.sw.prev{border-top:2px dashed var(--dust);}

.arearow{padding:14px 0;border-bottom:1px solid var(--iron);}
.arearow:last-child{border-bottom:none;}
.atop{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:9px;}
.an{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:15px;
  display:flex;align-items:center;gap:8px;}
.asc{font-size:19px;}
.pill{font-family:'Archivo';font-variation-settings:'wdth' 105,'wght' 700;font-size:8.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--dust);border:1px solid var(--iron);border-radius:4px;padding:3px 6px;}
.pill.on{color:var(--neon);border-color:var(--deep);background:var(--deep);}
.arearow .bar{position:relative;margin-top:0;}
.arearow .bar u{position:absolute;top:-3px;width:2px;height:11px;background:var(--dust);
  border-radius:99px;transform:translateX(-1px);}
.ameta{font-size:11.5px;color:var(--dust);margin-top:8px;}
.ameta b{color:var(--chalk);font-weight:600;}
.fine{font-size:11.5px;color:var(--dust);text-align:center;margin:0 0 6px;}

.ratestrip{width:100%;display:flex;align-items:center;justify-content:space-between;gap:12px;
  background:var(--slab);border:1px solid var(--neon);border-radius:14px;padding:15px 16px;margin-bottom:14px;}

.stepper{display:flex;align-items:center;justify-content:center;gap:14px;width:100%;max-width:300px;margin-bottom:10px;}
.stepper button{width:58px;height:58px;border-radius:999px;border:1px solid var(--iron);flex-shrink:0;
  font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 800;font-size:15px;text-align:center;
  transition:background .15s ease,border-color .15s ease,transform .1s ease;}
.stepper button:hover{background:var(--slab2);border-color:var(--dust);}
.stepper button:active{transform:scale(.94);}
.sval{flex:1;text-align:center;}
.sval b{display:block;font-size:56px;line-height:1;}
.sval em{font-style:normal;font-size:11px;color:var(--dust);letter-spacing:.14em;text-transform:uppercase;}

.scorepeek{display:flex;align-items:center;justify-content:center;gap:10px;margin-top:20px;
  border-top:1px solid var(--iron);padding-top:16px;width:100%;max-width:300px;}
.scorepeek b{font-size:22px;color:var(--neon);}
.scorepeek em{font-style:normal;font-size:11.5px;color:var(--dust);}

/* ── neon layer: pure white + bloom marks the accent, softer white is body text ── */
.disp{color:var(--neon);}
.mark span{text-shadow:var(--glow);}
.stnum b,.cdone,.restnum,.scorepeek b,.bignum,.sval b,.overall,.up{text-shadow:var(--glow);}
.tile b.hot{text-shadow:var(--glow);}
.dot.hit,.pip,.badge.got .bdot,.unode.now{box-shadow:var(--glowsm);}
.bar i,.sbar i,.lvlbar i,.pbar i{box-shadow:var(--glowsm);}
.btn.primary,.toast{box-shadow:var(--glow);}
.chip.on,.seg2 button.act{box-shadow:var(--glowsm);}
.nd.done{box-shadow:var(--glowsm);}
.nd.now{border-color:var(--neon);box-shadow:var(--glowsm);}
.card.lit,.pcard.lit,.gencard,.card.pro,.ratestrip{box-shadow:0 0 26px rgba(255,255,255,.06);}
.glowline{filter:drop-shadow(0 0 5px rgba(255,255,255,.55));}
.seg.filled{background:var(--dust);}
.mbar.on{background:var(--chalk);}
.tag{color:var(--neon);}
.wcat.pro{color:var(--neon);border-color:rgba(255,255,255,.35);}
.gencard{background:linear-gradient(150deg,rgba(255,255,255,.07),var(--slab));}
.card.pro{background:linear-gradient(160deg,rgba(255,255,255,.06),var(--slab));}
.rlab{fill:#6E6E77;}

/* ── fuel + scanner ── */
.tab{padding:0 2px;}
.nav .tab{font-size:8.5px;letter-spacing:.06em;gap:5px;}
.kcal{font-size:38px;margin:6px 0 8px;line-height:1;}
.kcal.sm{font-size:30px;}
.kcal.big{font-size:46px;margin:2px 0 10px;}
.kcal em{font-style:normal;font-size:13px;color:var(--dust);
  font-variation-settings:'wdth' 100,'wght' 500;margin-left:7px;text-shadow:none;}
.xbtn{width:26px;height:26px;border-radius:999px;border:1px solid var(--iron);display:grid;
  place-items:center;color:var(--dust);margin-left:10px;flex-shrink:0;transition:all .15s ease;}
.xbtn:hover{color:var(--neon);border-color:var(--dust);}

.finder{width:100%;max-width:300px;aspect-ratio:3/4;border-radius:20px;overflow:hidden;position:relative;
  background:var(--slab);border:1px solid var(--iron);}
.feed{width:100%;height:100%;object-fit:cover;display:block;}
.nofeed{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:12px;color:var(--dust);text-align:center;padding:20px;}
.corner{position:absolute;width:26px;height:26px;border:2px solid var(--neon);opacity:.85;}
.corner.tl{top:14px;left:14px;border-right:none;border-bottom:none;border-radius:8px 0 0 0;}
.corner.tr{top:14px;right:14px;border-left:none;border-bottom:none;border-radius:0 8px 0 0;}
.corner.bl{bottom:14px;left:14px;border-right:none;border-top:none;border-radius:0 0 0 8px;}
.corner.br{bottom:14px;right:14px;border-left:none;border-top:none;border-radius:0 0 8px 0;}
.finder.reading{border-color:var(--neon);box-shadow:0 0 30px rgba(255,255,255,.13);}
.scanline{position:absolute;left:0;right:0;height:2px;background:var(--neon);
  box-shadow:0 0 16px 3px rgba(255,255,255,.75);animation:sweep 1.7s cubic-bezier(.5,0,.5,1) infinite;}
@keyframes sweep{0%{top:6%;opacity:0}12%{opacity:1}88%{opacity:1}100%{top:94%;opacity:0}}

.shutter{width:70px;height:70px;border-radius:999px;background:var(--neon);margin:24px 0 12px;
  box-shadow:0 0 0 5px var(--void),0 0 0 7px var(--neon),var(--glow);transition:transform .1s ease;flex-shrink:0;}
.shutter:active{transform:scale(.92);}

.scanlist{width:100%;max-width:330px;margin-top:16px;text-align:left;}
.scanrow{display:flex;align-items:center;gap:12px;padding:11px 0;border-bottom:1px solid var(--iron);}
.scanrow:last-child{border-bottom:none;}
.scanrow.off{opacity:.38;}
.scanrow.off .rn{text-decoration:line-through;}
.tickbox{width:21px;height:21px;border-radius:6px;border:1.5px solid var(--iron);flex-shrink:0;
  display:grid;place-items:center;padding:0;transition:all .15s ease;}
.scanrow:not(.off) .tickbox{background:var(--neon);border-color:var(--neon);box-shadow:var(--glowsm);}
.tickbox svg{width:11px;height:11px;}
.conf{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:10.5px;color:var(--dust);
  border:1px solid var(--iron);border-radius:5px;padding:3px 6px;flex-shrink:0;}
.conf.low{color:var(--neon);border-color:rgba(255,255,255,.4);}

.skx.limeneon{--neon:#D8FF45;--deep:rgba(216,255,69,.15);--iron:#28301F;--slab:#0E110C;--slab2:#151A12;
  --void:#060705;--chalk:#E3EAD6;--dust:#7E8873;
  --glow:0 0 18px rgba(216,255,69,.55);--glowsm:0 0 10px rgba(216,255,69,.45);}
.skx.lime{--neon:#C8F32C;--deep:rgba(200,243,44,.12);--iron:#252A22;--slab:#0F120E;--slab2:#161A14;
  --void:#08090A;--chalk:#E1E6DA;--dust:#7B827A;
  --glow:0 0 12px rgba(200,243,44,.25);--glowsm:0 0 7px rgba(200,243,44,.2);}
.swatch{width:9px;height:9px;border-radius:99px;display:inline-block;margin-right:7px;vertical-align:middle;}
.swatch[data-t="limeneon"]{background:#D8FF45;box-shadow:0 0 8px rgba(216,255,69,.7);}
.swatch[data-t="lime"]{background:#C8F32C;}
.swatch[data-t="neon"]{background:#FFFFFF;box-shadow:0 0 8px rgba(255,255,255,.6);}
.chip.on .swatch{box-shadow:none;}

.demo.has{padding:0;border-color:var(--neon);box-shadow:var(--glowsm);}
.clip{width:100%;height:100%;object-fit:cover;display:block;border-radius:13px;}
.addclip{position:absolute;bottom:9px;left:11px;font-family:'Archivo';
  font-variation-settings:'wdth' 108,'wght' 700;font-size:9px;letter-spacing:.12em;text-transform:uppercase;
  color:var(--neon);border:1px solid var(--iron);border-radius:6px;padding:5px 8px;cursor:pointer;
  transition:border-color .15s ease;}
.addclip:hover{border-color:var(--neon);}
.addclip input{display:none;}

.auth{max-width:428px;margin:0 auto;min-height:100vh;padding:0 22px 30px;display:flex;
  flex-direction:column;justify-content:space-between;gap:28px;}
.authtop{padding-top:16vh;}
.authtop.narrow{padding-top:52px;}
.mark.big{font-size:26px;margin-bottom:22px;}
.authtag{font-size:38px;line-height:1.03;}
.authh{font-size:31px;margin:14px 0 8px;line-height:1.05;}
.backbtn{width:34px;height:34px;border-radius:999px;border:1px solid var(--iron);display:grid;
  place-items:center;color:var(--dust);margin-bottom:20px;}
.backbtn:hover{color:var(--neon);border-color:var(--dust);}
.authfoot{display:flex;flex-direction:column;}
.authfoot .btn.primary{margin-top:0;}
.authfoot .btn.outline{margin-top:9px;}
.or{display:flex;align-items:center;gap:12px;margin:18px 0 12px;color:var(--dust);font-size:11px;}
.or::before,.or::after{content:"";flex:1;height:1px;background:var(--iron);}

.form{margin-top:26px;display:flex;flex-direction:column;gap:16px;}
.field{display:block;}
.field .eyebrow{display:block;margin-bottom:8px;}
.input{width:100%;background:var(--slab);border:1px solid var(--iron);border-radius:11px;
  padding:14px 13px;color:var(--chalk);font-family:inherit;font-size:15px;outline:none;
  transition:border-color .15s ease,box-shadow .15s ease;}
.input::placeholder{color:var(--dust);}
.input:focus{border-color:var(--neon);box-shadow:var(--glowsm);}
.input.bad{border-color:#C4564E;}
.err{display:block;font-size:11.5px;color:#E08A83;margin-top:7px;}
.pwwrap{position:relative;display:block;}
.pwtog{position:absolute;right:12px;top:50%;transform:translateY(-50%);font-size:11px;
  color:var(--dust);letter-spacing:.06em;padding:4px;}
.pwtog:hover{color:var(--neon);}
.strength{display:flex;align-items:center;gap:9px;margin-top:9px;}
.strength i{height:3px;flex:1;background:var(--iron);border-radius:99px;position:relative;overflow:hidden;}
.strength i::after{content:"";position:absolute;left:0;top:0;bottom:0;background:var(--neon);
  border-radius:99px;transition:width .3s ease;}
.strength i.s1::after{width:33%;background:#C4564E;}
.strength i.s2::after{width:66%;}
.strength i.s3::after{width:100%;box-shadow:var(--glowsm);}
.strength em{font-style:normal;font-size:11px;color:var(--dust);white-space:nowrap;}

.obwrap{margin-top:24px;}
.ob{width:100%;text-align:left;background:var(--slab);border:1px solid var(--iron);border-radius:13px;
  padding:15px;margin-bottom:9px;transition:border-color .15s ease,background .15s ease;}
.ob:hover{border-color:var(--dust);}
.ob.on{border-color:var(--neon);background:var(--deep);}
.obn{display:block;font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;
  font-size:15.5px;margin-bottom:4px;}
.obd{display:block;font-size:12px;color:var(--dust);line-height:1.45;}

/* ── exercise detail + library ── */
.detail-full{align-items:center;}
.dscroll{width:100%;max-width:428px;padding:4px 20px 40px;overflow-y:auto;flex:1;}
.dscroll .demo{max-width:100%;aspect-ratio:16/10;margin-bottom:0;}
.chip.static{cursor:default;border-color:var(--iron);color:var(--dust);}
.chip.static:hover{color:var(--dust);border-color:var(--iron);}

.steps2{list-style:none;padding:0;margin:0 0 16px;counter-reset:s;}
.steps2 li{display:flex;gap:13px;padding:12px 0;border-bottom:1px solid var(--iron);}
.steps2 li:last-child{border-bottom:none;}
.snum{width:24px;height:24px;border-radius:999px;border:1px solid var(--neon);color:var(--neon);
  display:grid;place-items:center;flex-shrink:0;font-family:'Archivo';
  font-variation-settings:'wght' 800;font-size:11px;box-shadow:var(--glowsm);}
.steps2 p{margin:2px 0 0;font-size:13.5px;line-height:1.55;color:var(--chalk);}

.twocol{display:grid;grid-template-columns:1fr 1fr;gap:9px;}
.minicard{background:var(--slab);border:1px solid var(--iron);border-radius:12px;padding:13px;}
.minicard p{margin:8px 0 0;font-size:12px;line-height:1.5;color:var(--dust);}

.card.mistake{padding:15px;margin-bottom:9px;}
.mrow{display:flex;gap:10px;align-items:flex-start;}
.mrow.fix{margin-top:10px;padding-top:10px;border-top:1px solid var(--iron);}
.mrow b{font-size:13.5px;font-weight:600;line-height:1.45;}
.mrow p{margin:0;font-size:12.5px;line-height:1.5;color:var(--dust);}
.mx,.mv{width:19px;height:19px;border-radius:5px;display:grid;place-items:center;font-size:10px;flex-shrink:0;}
.mx{background:rgba(196,86,78,.16);color:#E08A83;}
.mv{background:var(--deep);color:var(--neon);}

.bodies{display:flex;gap:12px;justify-content:center;background:var(--slab);border:1px solid var(--iron);
  border-radius:14px;padding:16px;margin-bottom:14px;}
.bodywrap{display:flex;flex-direction:column;align-items:center;gap:8px;flex:1;}
.body{width:100%;max-width:96px;height:auto;}
.skin{fill:var(--slab2);}
.mus{fill:var(--neon);transition:opacity .3s ease;}
.mlegend{display:grid;grid-template-columns:1fr 1fr;gap:12px;}
.mlegend p{margin:7px 0 0;font-size:13px;line-height:1.5;}
.mlegend p.dim{color:var(--dust);}

.rung{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:18px;}
.rungbox{background:var(--slab);border:1px solid var(--iron);border-radius:12px;padding:13px;}
.rungbox b{display:block;margin-top:7px;font-family:'Archivo';
  font-variation-settings:'wdth' 110,'wght' 700;font-size:14px;color:var(--neon);}

.searchbox{display:flex;align-items:center;gap:9px;background:var(--slab);border:1px solid var(--iron);
  border-radius:11px;padding:11px 13px;margin-bottom:12px;}
.searchbox svg{width:15px;height:15px;color:var(--dust);flex-shrink:0;}
.searchbox input{background:none;border:none;outline:none;color:var(--chalk);font-family:inherit;
  font-size:14px;width:100%;min-width:0;}
.searchbox input::placeholder{color:var(--dust);}

.exnamebtn{display:flex;flex-direction:column;align-items:center;gap:8px;margin-bottom:22px;text-align:center;}
.howto{font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:9.5px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--neon);border:1px solid var(--iron);
  border-radius:6px;padding:5px 9px;transition:border-color .15s ease;}
.exnamebtn:hover .howto{border-color:var(--neon);}
.pbody .exnamebtn .exname{margin-bottom:0;}

.daycard{padding:0;overflow:hidden;}
.dayhead{display:flex;align-items:center;gap:13px;width:100%;padding:16px;}
.daynum{width:30px;height:30px;border-radius:999px;border:1.5px solid var(--iron);flex-shrink:0;
  display:grid;place-items:center;font-family:'Archivo';font-variation-settings:'wght' 800;font-size:12px;
  color:var(--dust);}
.daynum.done{background:var(--neon);border-color:var(--neon);box-shadow:var(--glowsm);}
.daynum svg{width:12px;height:12px;}
.dayt{display:block;font-family:'Archivo';font-variation-settings:'wdth' 114,'wght' 800;font-size:16px;}
.dayf{display:block;font-size:11.5px;color:var(--dust);margin-top:3px;}
.daycard .row,.daycard .btn{margin-left:16px;margin-right:16px;}
.daycard .btn.primary{width:calc(100% - 32px);}
.daycard .btn.outline{width:calc(100% - 32px);margin-bottom:16px;}

.meal{padding:16px;margin-bottom:9px;}
.mtop{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:13px;}
.macros{display:flex;gap:14px;flex-wrap:wrap;}
.macro b{display:block;font-size:17px;line-height:1;}
.macro em{font-style:normal;font-size:10px;color:var(--dust);letter-spacing:.1em;text-transform:uppercase;}
.mbars{display:flex;gap:2px;height:5px;margin-top:13px;border-radius:99px;overflow:hidden;}
.mbars i{display:block;border-radius:99px;}
.mbars .p{background:var(--neon);box-shadow:var(--glowsm);}
.mbars .c{background:var(--dust);}
.mbars .f{background:var(--iron);}

.social{display:flex;flex-direction:column;gap:7px;margin-top:15px;}
.soc{display:flex;align-items:center;justify-content:space-between;gap:12px;text-decoration:none;
  border:1px solid var(--iron);border-radius:11px;padding:12px 14px;color:inherit;transition:all .15s ease;}
.soc:hover{border-color:var(--neon);background:var(--slab2);}
.socp{font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:10px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--dust);}
.soch{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:13.5px;color:var(--neon);}

.perkbox{border-top:1px solid var(--iron);margin-top:18px;padding-top:14px;}
.best.owned{background:none;border:1px solid var(--neon);color:var(--neon);}
.plans{display:flex;flex-direction:column;gap:8px;margin:20px 0 4px;}
.plan{border:1px solid var(--iron);border-radius:13px;padding:14px;display:block;
  transition:border-color .15s ease,background .15s ease;position:relative;}
.plan:hover{border-color:var(--dust);}
.plan.on{border-color:var(--neon);background:var(--deep);box-shadow:var(--glowsm);}
.planl{display:flex;align-items:center;gap:9px;font-family:'Archivo';
  font-variation-settings:'wdth' 112,'wght' 700;font-size:14px;margin-bottom:6px;}
.best{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:8.5px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--void);background:var(--neon);border-radius:4px;padding:3px 6px;}
.planp{display:block;font-size:25px;line-height:1;}
.planp em{font-style:normal;font-size:11.5px;color:var(--dust);margin-left:7px;
  font-variation-settings:'wdth' 100,'wght' 500;text-shadow:none;}
.plann{display:block;font-size:11.5px;color:var(--dust);margin-top:7px;}
.minorbox{border:1px solid var(--iron);border-radius:13px;padding:15px;margin:18px 0 4px;}
.btn.locked{opacity:.75;display:flex;align-items:center;justify-content:center;gap:8px;}
.lockico{font-size:11px;filter:grayscale(1);}

.card.gated{opacity:.9;}
.track.ghost{opacity:.35;pointer-events:none;margin-bottom:14px;}
.track.ghost .nd{cursor:default;}
.card.gated .pdesc{margin-bottom:2px;}

/* ══════════ POLISH ══════════ */

/* knurling — the crosshatch cut into a pull-up bar, used as the section rule */
.knurl{flex:1;height:9px;min-width:18px;margin:0 12px;opacity:.5;
  background-image:
    repeating-linear-gradient(45deg, rgba(255,255,255,.16) 0 1px, transparent 1px 5px),
    repeating-linear-gradient(-45deg, rgba(255,255,255,.16) 0 1px, transparent 1px 5px);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);
  mask-image:linear-gradient(90deg,transparent,#000 22%,#000 78%,transparent);}
.head{align-items:center;}

/* chalk dust */
.grain{position:fixed;inset:0;pointer-events:none;z-index:99;opacity:.032;mix-blend-mode:screen;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");}

/* surfaces: lit from above, like a bar under a park lamp */
.card,.wcard,.pcard,.tile,.badge,.meal,.gencard,.ratestrip,.plan,.ob,.minorbox{
  background-image:linear-gradient(180deg, rgba(255,255,255,.030), rgba(255,255,255,0) 42%);
  border-color:rgba(255,255,255,.085);}
.card,.pcard,.meal,.gencard{box-shadow:inset 0 1px 0 rgba(255,255,255,.055), 0 1px 2px rgba(0,0,0,.4);}
.card.lit,.pcard.lit,.card.pro,.ratestrip,.plan.on{border-color:var(--neon);}

/* numerals line up in columns — this is a stats app */
.disp,.rs,.sv,.conf,.chv,.bcount{font-variant-numeric:tabular-nums;font-feature-settings:'tnum' 1;}
.disp{letter-spacing:-.02em;}
.eyebrow{font-size:9.5px;letter-spacing:.18em;}
.screentitle{font-size:36px;letter-spacing:-.03em;}
.meta{line-height:1.5;}

/* presses that feel physical */
.wcard,.chip,.btn,.plan,.ob,.quick,.soc{transition:transform .13s cubic-bezier(.2,.8,.3,1),
  border-color .18s ease, background-color .18s ease, box-shadow .18s ease;}
.wcard:active,.plan:active,.ob:active,.soc:active{transform:scale(.99);}
.chip:active{transform:scale(.96);}
.btn.primary:hover{filter:brightness(1.06);}
.btn.outline:hover{background:rgba(255,255,255,.045);}

/* the accent bar fills read as lit filament, not flat paint */
.bar i,.sbar i,.lvlbar i{background-image:linear-gradient(90deg, rgba(255,255,255,.25), transparent 60%);}

/* rails and nodes sit on the surface rather than in it */
.nd{box-shadow:0 1px 3px rgba(0,0,0,.5);}
.nd.done,.nd.now{box-shadow:var(--glowsm), 0 1px 3px rgba(0,0,0,.5);}

/* locked things recede instead of shouting */
.card.gated{background-image:linear-gradient(180deg, rgba(255,255,255,.018), rgba(255,255,255,0) 42%);}
.lockico{width:12px;height:14px;}

/* section rhythm */
main{padding-bottom:34px;}
.head{margin-bottom:12px;}
.card{margin-bottom:22px;}

.card.creavoa{border-color:rgba(255,255,255,.16);}
.ctools{display:grid;grid-template-columns:1fr 1fr;gap:1px;background:var(--iron);
  border:1px solid var(--iron);border-radius:12px;overflow:hidden;margin-top:16px;}
.ctool{background:var(--slab);padding:11px 12px;}
.ctn{display:block;font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 700;
  font-size:11.5px;margin-bottom:4px;}
.ctd{display:block;font-size:10px;color:var(--dust);line-height:1.4;}
.card.creavoa .btn.primary{margin-top:16px;}
.card.creavoa .btnrow{margin-top:8px;}
.card.creavoa .btn.ghost{display:flex;align-items:center;justify-content:center;}

.savedot{width:6px;height:6px;border-radius:99px;background:var(--neon);display:inline-block;
  margin-right:7px;vertical-align:middle;box-shadow:var(--glowsm);}
.savedot.saving{background:var(--dust);box-shadow:none;animation:blip 1s ease-in-out infinite;}
.savedot.error{background:#C4564E;box-shadow:none;}
@keyframes blip{0%,100%{opacity:1}50%{opacity:.3}}
.btn.outline.danger{border-color:#5A2A26;color:#D98A83;margin-top:9px;}
.btn.outline.danger:hover{background:rgba(180,50,45,.1);}

.phright{display:flex;align-items:center;gap:11px;}
.voicebtn{width:32px;height:32px;border-radius:999px;border:1px solid var(--iron);display:grid;
  place-items:center;color:var(--dust);transition:all .18s ease;flex-shrink:0;}
.voicebtn svg{width:15px;height:15px;}
.voicebtn:hover{color:var(--chalk);border-color:var(--dust);}
.voicebtn.on{background:var(--neon);border-color:var(--neon);color:var(--void);box-shadow:var(--glow);}

.voicebar{display:flex;align-items:center;gap:10px;width:100%;max-width:428px;margin:0 auto;
  padding:10px 20px;border-bottom:1px solid var(--iron);}
.voicebar.warn .voicetxt{color:#D98A83;}
.miclive{width:7px;height:7px;border-radius:99px;background:var(--neon);flex-shrink:0;
  box-shadow:var(--glowsm);animation:mic 1.4s ease-in-out infinite;}
@keyframes mic{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.72)}}
.voicetxt{flex:1;min-width:0;font-size:12px;color:var(--dust);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.voicehelp{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:9px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--neon);flex-shrink:0;}
.cmdlist{width:100%;max-width:428px;margin:0 auto;padding:12px 20px 4px;
  border-bottom:1px solid var(--iron);}
.cmdrow{display:flex;align-items:baseline;justify-content:space-between;gap:12px;padding:6px 0;}
.cmdl{font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 700;font-size:12px;white-space:nowrap;}
.cmdd{font-size:11px;color:var(--dust);text-align:right;}

.logo{display:inline-flex;align-items:center;gap:9px;}
.logomark{color:var(--neon);display:grid;place-items:center;line-height:0;}
.mark-svg{display:block;filter:drop-shadow(0 0 7px rgba(255,255,255,.35));}
.skx.limeneon .mark-svg{filter:drop-shadow(0 0 8px rgba(216,255,69,.55));}
.skx.lime .mark-svg{filter:none;}
.logoword{font-family:'Archivo';font-variation-settings:'wdth' 125,'wght' 800;
  font-size:calc(var(--ls) * .86);letter-spacing:.03em;text-transform:uppercase;color:var(--chalk);}
.logoword span{color:var(--neon);text-shadow:var(--glow);}
.logolock{display:flex;flex-direction:column;align-items:flex-start;gap:16px;}
.logomark.big{width:78px;height:78px;border-radius:22px;border:1px solid var(--iron);
  background:linear-gradient(160deg,var(--slab2),var(--slab));box-shadow:0 0 34px -8px var(--neon);}

.fine.warn{color:#D9A57E;}
.pcard .peek{margin-top:4px;}

.cover{border-top:1px solid var(--iron);margin-top:16px;padding-top:14px;}
.covrow{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px;}
.cov{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--iron);border-radius:999px;
  padding:6px 11px;font-size:11.5px;color:var(--dust);transition:all .18s ease;}
.cov.on{border-color:var(--neon);color:var(--chalk);}
.cov em{font-style:normal;font-family:'Archivo';font-variation-settings:'wght' 700;font-size:10px;color:var(--dust);}
.cov.on em{color:var(--neon);}

.plans-screen{align-items:center;}
.planscroll{width:100%;max-width:428px;flex:1;overflow-y:auto;padding:4px 20px 20px;}
.planhero{padding:8px 0 20px;}
.planfoot{width:100%;max-width:428px;padding:14px 20px 26px;border-top:1px solid var(--iron);
  background:var(--void);flex-shrink:0;}
.planfoot .btn.primary{margin-top:0;}

.matrix{margin-top:16px;border-top:1px solid var(--iron);}
.mgroup{display:block;padding:16px 0 8px;}
.mrow{display:flex;align-items:center;gap:6px;padding:9px 0;border-bottom:1px solid var(--iron);}
.mrow:last-child{border-bottom:none;}
.mrow.mhead{position:sticky;top:0;background:var(--void);z-index:2;border-bottom:1px solid var(--iron);padding:10px 0;}
.mlab{flex:1;min-width:0;font-size:11.5px;line-height:1.35;color:var(--chalk);padding-right:4px;}
.mcol{width:46px;flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:2px;
  border-radius:7px;padding:3px 0;transition:background .18s ease;}
.mcol.on{background:var(--deep);}
.mcol b{font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 800;font-size:10.5px;}
.mcol em{font-style:normal;font-size:8.5px;color:var(--dust);}
.mtick{width:13px;height:13px;color:var(--neon);}
.mdash{width:9px;height:1.5px;background:var(--iron);border-radius:99px;display:block;}

.fab{position:fixed;right:18px;bottom:92px;z-index:40;display:flex;align-items:center;gap:8px;
  background:var(--neon);color:var(--void);border-radius:999px;padding:11px 16px 11px 13px;
  font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 800;font-size:11.5px;
  letter-spacing:.1em;text-transform:uppercase;box-shadow:var(--glow);transition:transform .12s ease;}
.fab:active{transform:scale(.95);}
.fab svg{display:block;}

.coach .phead .dim{color:var(--dust);}
.chat{width:100%;max-width:428px;flex:1;overflow-y:auto;padding:8px 20px 12px;display:flex;
  flex-direction:column;gap:12px;}
.chatintro{text-align:center;padding:22px 0 8px;}
.chatintro .chips{justify-content:center;}
.coachmark{display:inline-grid;place-items:center;width:62px;height:62px;border-radius:18px;
  border:1px solid var(--iron);background:linear-gradient(160deg,var(--slab2),var(--slab));
  color:var(--neon);box-shadow:0 0 28px -8px var(--neon);}
.bubble{max-width:86%;padding:12px 14px;border-radius:15px;font-size:14px;line-height:1.5;white-space:pre-wrap;}
.bubble.user{align-self:flex-end;background:var(--neon);color:var(--void);border-bottom-right-radius:5px;
  font-weight:500;}
.bubble.assistant{align-self:flex-start;background:var(--slab);border:1px solid var(--iron);
  border-bottom-left-radius:5px;}
.bubble.thinking{display:flex;gap:5px;align-items:center;padding:15px 16px;}
.dotpulse{width:6px;height:6px;border-radius:99px;background:var(--dust);animation:think 1.3s ease-in-out infinite;}
.dotpulse:nth-child(2){animation-delay:.18s}.dotpulse:nth-child(3){animation-delay:.36s}
@keyframes think{0%,100%{opacity:.28;transform:translateY(0)}50%{opacity:1;transform:translateY(-3px)}}

.chatfoot{width:100%;max-width:428px;padding:12px 20px 26px;border-top:1px solid var(--iron);flex-shrink:0;}
.chatbar{display:flex;align-items:center;gap:9px;}
.chatinput{flex:1;min-width:0;background:var(--slab);border:1px solid var(--iron);border-radius:12px;
  padding:13px 14px;color:var(--chalk);font-family:inherit;font-size:14.5px;outline:none;
  transition:border-color .15s ease,box-shadow .15s ease;}
.chatinput::placeholder{color:var(--dust);}
.chatinput:focus{border-color:var(--neon);box-shadow:var(--glowsm);}
.sendbtn{width:44px;height:44px;border-radius:12px;background:var(--neon);color:var(--void);
  display:grid;place-items:center;flex-shrink:0;box-shadow:var(--glowsm);transition:opacity .15s ease;}
.sendbtn svg{width:18px;height:18px;}
.sendbtn:disabled{opacity:.3;box-shadow:none;cursor:default;}

/* ── AI core ── */
.core{background:radial-gradient(120% 80% at 50% 48%, rgba(255,255,255,.045), transparent 62%), var(--void);}
.cmono{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:10px;letter-spacing:.14em;
  text-transform:uppercase;}
.cmono.b{color:var(--neon);font-weight:600;text-shadow:var(--glowsm);}
.cmono.dim{color:var(--dust);}
.corebar{width:100%;max-width:428px;display:flex;align-items:center;gap:9px;padding:16px 16px 12px;
  border-bottom:1px solid var(--iron);flex-shrink:0;}
.corestats{margin-left:auto;display:flex;align-items:center;gap:12px;}
.cstat{display:flex;flex-direction:column;align-items:flex-end;line-height:1.1;}
.cstat b{font-family:'IBM Plex Mono',monospace;font-size:14px;font-weight:600;color:var(--neon);
  text-shadow:var(--glowsm);}
.cstat em{font-style:normal;font-family:'IBM Plex Mono',monospace;font-size:7px;letter-spacing:.12em;color:var(--dust);}
.clock{font-size:9px;}
.corebar .close{width:26px;height:26px;}

.usage{position:absolute;top:64px;right:14px;z-index:4;border:1px solid var(--iron);border-radius:8px;
  padding:9px 11px;background:rgba(8,9,10,.72);backdrop-filter:blur(6px);min-width:118px;}
.urow{display:flex;align-items:baseline;justify-content:space-between;gap:12px;
  border-bottom:1px solid var(--iron);padding:6px 0;}
.urow:last-child{border-bottom:none;}
.urow em,.urow b{font-family:'IBM Plex Mono',monospace;font-size:9px;letter-spacing:.1em;font-style:normal;}
.urow em{color:var(--dust);}
.urow b{color:var(--neon);}

.field{position:relative;width:100%;max-width:428px;aspect-ratio:100/115;margin:auto;flex-shrink:0;}
.wires{position:absolute;inset:0;width:100%;height:100%;}
.wire{stroke:var(--neon);stroke-width:.18;opacity:.3;vector-effect:non-scaling-stroke;}
.wire.hot{opacity:.95;stroke-width:.5;}

.rings{position:absolute;left:50%;top:47.8%;transform:translate(-50%,-50%);pointer-events:none;}
.ring{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);border-radius:999px;
  border:1px dashed var(--iron);display:block;}
.ring.r1{width:112px;height:112px;border-color:rgba(255,255,255,.16);animation:spin 34s linear infinite;}
.ring.r2{width:166px;height:166px;animation:spin 58s linear infinite reverse;}
.ring.r3{width:222px;height:222px;border-style:dotted;opacity:.5;animation:spin 92s linear infinite;}
@keyframes spin{to{transform:translate(-50%,-50%) rotate(360deg);}}

.orb{position:absolute;left:50%;top:47.8%;transform:translate(-50%,-50%);width:66px;height:66px;
  border-radius:999px;background:var(--neon);color:var(--void);display:grid;place-items:center;
  box-shadow:0 0 0 7px rgba(255,255,255,.07),0 0 44px -4px var(--neon);z-index:3;
  transition:transform .14s ease;}
.orb:active{transform:translate(-50%,-50%) scale(.94);}
.orb svg{width:22px;height:22px;}
.orblab{position:absolute;bottom:11px;font-family:'IBM Plex Mono',monospace;font-size:6.5px;
  letter-spacing:.14em;opacity:.6;}
.corename{position:absolute;left:50%;top:64%;transform:translateX(-50%);color:var(--dust);z-index:2;}

.node{position:absolute;transform:translate(-50%,-50%);z-index:2;min-width:78px;
  border:1px solid var(--iron);border-radius:8px;padding:8px 10px;
  background:rgba(10,11,13,.86);backdrop-filter:blur(4px);transition:all .16s ease;}
.node:hover{border-color:var(--neon);}
.node.on{border-color:var(--neon);box-shadow:var(--glowsm);background:var(--deep);}
.node.locked{opacity:.55;}
.nl{display:block;font-family:'IBM Plex Mono',monospace;font-size:10px;font-weight:600;
  letter-spacing:.12em;color:var(--neon);}
.node.locked .nl{color:var(--dust);}
.ns{display:block;font-family:'IBM Plex Mono',monospace;font-size:8px;letter-spacing:.08em;
  color:var(--dust);margin-top:3px;}

@media (max-width:400px){
  .node{min-width:66px;padding:6px 8px;}
  .nl{font-size:9px;}
  .corestats{gap:9px;}
  .cstat b{font-size:12px;}
}

.nowtitle{font-size:24px;margin:10px 0 6px;}
.transport{display:flex;align-items:center;justify-content:center;gap:26px;margin:22px 0 18px;}
.transport button{color:var(--dust);transition:color .15s ease;}
.transport button:hover:not(:disabled){color:var(--neon);}
.transport button:disabled{opacity:.28;cursor:default;}
.transport svg{width:20px;height:20px;display:block;}
.playbig{width:56px;height:56px;border-radius:999px;background:var(--neon);color:var(--void)!important;
  display:grid;place-items:center;box-shadow:var(--glow);transition:transform .1s ease;}
.playbig:active{transform:scale(.94);}
.playbig:disabled{background:var(--iron);color:var(--dust)!important;box-shadow:none;}
.playbig svg{width:19px;height:19px;}
.volrow{display:flex;align-items:center;gap:11px;padding:0 4px;}
.volrow svg{width:16px;height:16px;color:var(--dust);flex-shrink:0;}
.vol{flex:1;-webkit-appearance:none;appearance:none;height:4px;border-radius:99px;background:var(--iron);outline:none;}
.vol::-webkit-slider-thumb{-webkit-appearance:none;width:15px;height:15px;border-radius:99px;
  background:var(--neon);box-shadow:var(--glowsm);cursor:pointer;}
.vol::-moz-range-thumb{width:15px;height:15px;border:none;border-radius:99px;background:var(--neon);cursor:pointer;}

.trow{padding:0;}
.trowmain{display:flex;align-items:center;gap:12px;flex:1;min-width:0;padding:13px 0;}
.trow.on .rn{color:var(--neon);}
.tnum{width:22px;flex-shrink:0;font-family:'Archivo';font-variation-settings:'wght' 700;
  font-size:10px;color:var(--dust);letter-spacing:.06em;}
.eqbars{display:flex;align-items:flex-end;gap:2px;height:12px;}
.eqbars i{width:2.5px;background:var(--neon);border-radius:99px;animation:eq .9s ease-in-out infinite;}
.eqbars i:nth-child(1){height:60%;animation-delay:0s}
.eqbars i:nth-child(2){height:100%;animation-delay:.22s}
.eqbars i:nth-child(3){height:45%;animation-delay:.44s}
@keyframes eq{0%,100%{transform:scaleY(.35)}50%{transform:scaleY(1)}}
.addtracks{position:relative;cursor:pointer;margin-top:14px;}
.addtracks input{position:absolute;inset:0;opacity:0;cursor:pointer;}

.planchip{border:1px solid var(--iron);border-radius:999px;padding:5px 11px;
  font-family:'Archivo';font-variation-settings:'wdth' 110,'wght' 800;font-size:10px;
  letter-spacing:.1em;text-transform:uppercase;color:var(--dust);transition:all .16s ease;white-space:nowrap;}
.planchip:hover{color:var(--chalk);border-color:var(--dust);}
.planchip.paid{color:var(--neon);border-color:var(--neon);box-shadow:var(--glowsm);}

.offbar{display:flex;align-items:center;gap:10px;background:var(--slab);border:1px solid var(--iron);
  border-radius:11px;padding:11px 13px;margin-bottom:16px;}
.offdot{width:7px;height:7px;border-radius:99px;background:#D9A57E;flex-shrink:0;}
.offtxt{flex:1;min-width:0;font-size:12px;color:var(--dust);}
.offbtn{font-family:'Archivo';font-variation-settings:'wght' 800;font-size:10px;letter-spacing:.12em;
  text-transform:uppercase;color:var(--neon);flex-shrink:0;}

.game .gamebody{width:100%;max-width:428px;flex:1;display:flex;flex-direction:column;align-items:center;
  justify-content:center;position:relative;padding:20px;cursor:pointer;user-select:none;touch-action:manipulation;}
.gscore{text-align:center;margin-bottom:8px;}
.gscore b{display:block;font-size:64px;line-height:1;}
.strikes{display:flex;gap:7px;margin-bottom:44px;}
.strike{width:9px;height:9px;border-radius:99px;border:1.5px solid var(--iron);}
.strike.out{background:#C4564E;border-color:#C4564E;}
.gbar{position:relative;width:100%;max-width:320px;height:52px;background:var(--slab);
  border:1px solid var(--iron);border-radius:12px;overflow:hidden;}
.gzone{position:absolute;top:0;bottom:0;background:var(--deep);}
.gcore{position:absolute;top:0;bottom:0;background:var(--neon);opacity:.32;}
.gneedle{position:absolute;top:5px;bottom:5px;width:4px;border-radius:99px;background:var(--chalk);
  transform:translateX(-2px);box-shadow:0 0 12px rgba(255,255,255,.6);}
.gflash{position:absolute;top:38%;font-family:'Archivo';font-variation-settings:'wdth' 118,'wght' 800;
  font-size:19px;letter-spacing:.14em;animation:flash .38s ease-out;}
.gflash.perfect{color:var(--neon);text-shadow:var(--glow);}
.gflash.good{color:var(--chalk);}
.gflash.miss{color:#C4564E;}
@keyframes flash{from{opacity:0;transform:translateY(8px) scale(.9)}to{opacity:1;transform:none}}
.goverlay{position:absolute;inset:0;background:rgba(6,7,5,.93);display:flex;flex-direction:column;
  align-items:center;justify-content:center;text-align:center;padding:26px;border-radius:14px;}

.offbar{display:flex;align-items:center;gap:11px;width:100%;border:1px solid var(--iron);
  border-radius:12px;padding:12px 14px;margin-bottom:18px;font-size:12px;color:var(--dust);
  line-height:1.4;background:var(--slab);}
.offbar b{color:var(--chalk);font-weight:600;}
.offbar svg{margin-left:auto;flex-shrink:0;}
.offdot{width:7px;height:7px;border-radius:99px;background:#C4564E;flex-shrink:0;}

.game .gamebody{width:100%;max-width:428px;flex:1;display:flex;flex-direction:column;
  align-items:center;justify-content:center;gap:30px;padding:0 20px;cursor:pointer;position:relative;
  user-select:none;-webkit-tap-highlight-color:transparent;}
.gscore{text-align:center;}
.gnum{font-size:64px;line-height:1;margin-bottom:6px;}
.gnum.big{font-size:74px;margin:10px 0 8px;}
.gbar{position:relative;width:100%;max-width:330px;height:16px;border-radius:99px;
  background:var(--slab);border:1px solid var(--iron);transition:border-color .15s ease;}
.gbar.hit{border-color:var(--neon);box-shadow:var(--glow);}
.gbar.miss{border-color:#C4564E;}
.gzone{position:absolute;top:-1px;bottom:-1px;background:var(--deep);border:1px solid var(--neon);
  border-radius:99px;transition:left .18s ease,width .18s ease;}
.gmark{position:absolute;top:50%;width:5px;height:30px;margin-left:-2.5px;border-radius:99px;
  background:var(--neon);transform:translateY(-50%);box-shadow:var(--glow);}
.glives{display:flex;gap:8px;}
.glife{width:9px;height:9px;border-radius:2px;background:var(--iron);transition:all .2s ease;}
.glife.on{background:var(--neon);box-shadow:var(--glowsm);}
.gover{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;
  justify-content:center;text-align:center;background:rgba(6,7,5,.92);backdrop-filter:blur(4px);
  padding:0 24px;border-radius:16px;}

.whyline{font-size:12.5px;color:var(--neon);margin-top:6px;font-style:italic;opacity:.85;}

.founder{display:inline-flex;align-items:center;gap:6px;margin-top:9px;padding:4px 10px;
  border:1px solid var(--neon);border-radius:999px;color:var(--neon);
  font-family:'Archivo';font-variation-settings:'wdth' 108,'wght' 800;
  font-size:9px;letter-spacing:.14em;text-transform:uppercase;box-shadow:var(--glowsm);}

.emailhl{color:var(--neon);font-weight:600;overflow-wrap:anywhere;}
.codebox{display:flex;gap:8px;margin-top:28px;}
.codedigit{flex:1;min-width:0;aspect-ratio:3/4;max-height:64px;text-align:center;
  background:var(--slab);border:1px solid var(--iron);border-radius:11px;color:var(--chalk);
  font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;font-size:24px;
  outline:none;padding:0;transition:border-color .15s ease,box-shadow .15s ease;}
.codedigit.filled{border-color:var(--dust);}
.codedigit:focus{border-color:var(--neon);box-shadow:var(--glowsm);}
.codedigit.bad{border-color:#C4564E;}
.codedigit:disabled{opacity:.4;}
.codebox.shake{animation:shk .38s cubic-bezier(.36,.07,.19,.97);}
@keyframes shk{10%,90%{transform:translateX(-2px)}20%,80%{transform:translateX(4px)}
 30%,50%,70%{transform:translateX(-7px)}40%,60%{transform:translateX(7px)}}
.resend{margin-top:18px;}

.hint{display:block;font-size:11px;color:var(--dust);margin-top:7px;}

.swap{display:inline-block;margin-left:8px;padding:2px 7px;border-radius:5px;
  border:1px solid var(--iron);color:var(--dust);font-family:'Archivo';
  font-variation-settings:'wdth' 105,'wght' 700;font-size:8px;letter-spacing:.1em;
  text-transform:uppercase;vertical-align:middle;}
.wstack{display:flex;align-items:center;gap:6px;flex-shrink:0;}
.wcat.above{color:var(--neon);border-color:rgba(255,255,255,.32);}
.wcat.easy{opacity:.6;}

.weekstrip{display:flex;gap:5px;margin-top:18px;padding-top:16px;border-top:1px solid var(--iron);}
.wcol{flex:1;display:flex;flex-direction:column;align-items:center;gap:7px;min-width:0;}
.wcol.today .wlab{color:var(--neon);}
.wlab{font-family:'Archivo';font-variation-settings:'wght' 700;font-size:8.5px;letter-spacing:.1em;color:var(--dust);}
.wpip{width:14px;height:14px;border-radius:5px;border:1.5px solid var(--iron);}
.wpip.rest{border-style:dashed;}
.wtype{font-size:8px;color:var(--dust);letter-spacing:.04em;}
.lvlpick{margin-top:18px;padding-top:16px;border-top:1px solid var(--iron);}
.daynum.rest{border-style:dashed;color:var(--dust);}
.restcard{opacity:.65;}
.restcard .dayhead{padding:16px;}

.skillcard{padding:0;overflow:hidden;margin-bottom:9px;}
.skillcard.now{border-color:var(--neon);}
.skillcard .bar,.skillcard .barlab{margin-left:16px;margin-right:16px;}
.skillhead{display:flex;align-items:center;gap:12px;width:100%;padding:15px 16px;}
.sdot2{width:24px;height:24px;border-radius:999px;border:1.5px solid var(--iron);flex-shrink:0;
  display:grid;place-items:center;}
.sdot2.done{background:var(--neon);border-color:var(--neon);}
.sdot2.done svg{width:11px;height:11px;}
.sdot2.now{border-color:var(--neon);}
.skilln{display:block;font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:15px;}
.skillpre{display:block;font-size:11.5px;color:var(--dust);margin-top:3px;}
.ladder{padding:6px 16px 16px;}
.rung{display:flex;align-items:flex-start;gap:12px;padding:6px 0;position:relative;}
.rungline{position:absolute;left:5px;top:18px;bottom:-6px;width:1px;background:var(--iron);}
.rungdot{width:11px;height:11px;border-radius:999px;border:1.5px solid var(--iron);flex-shrink:0;
  margin-top:3px;background:var(--slab);z-index:1;}
.rungdot.goal{background:var(--neon);border-color:var(--neon);box-shadow:var(--glowsm);}
.rungtxt{font-size:12.5px;color:var(--dust);line-height:1.45;}
.rung.trophy{padding-top:10px;}
.goalname{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;font-size:13px;
  letter-spacing:.1em;color:var(--neon);text-shadow:var(--glow);}
.ladder .btnrow{margin-top:14px;}

.skillcard{padding:0;overflow:hidden;margin-bottom:9px;}
.skillhead{display:flex;align-items:center;gap:12px;width:100%;padding:15px 16px;}
.skilln{display:block;font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 700;font-size:15.5px;}
.skillpre{display:block;font-size:11.5px;color:var(--dust);margin-top:3px;}
.ladder{padding:2px 16px 16px;}
.rung{display:flex;align-items:flex-start;gap:12px;padding:7px 0;position:relative;}
.rungline{position:absolute;left:5.5px;top:20px;bottom:-7px;width:1px;background:var(--iron);}
.rung.done .rungline{background:var(--dust);}
.rungdot{width:12px;height:12px;border-radius:999px;border:1.5px solid var(--iron);flex-shrink:0;
  margin-top:3px;background:var(--slab);z-index:1;display:grid;place-items:center;}
.rungdot svg{width:8px;height:8px;}
.rungdot.done{background:var(--neon);border-color:var(--neon);}
.rungdot.now{border-color:var(--neon);box-shadow:var(--glowsm);}
.rungdot.goal{width:14px;height:14px;background:var(--neon);border-color:var(--neon);box-shadow:var(--glow);}
.rungtxt{display:block;font-size:13px;line-height:1.4;}
.rung.lock .rungtxt{color:var(--dust);}
.rungreq{display:block;font-size:11px;color:var(--dust);margin-top:2px;}
.goalname{font-family:'Archivo';font-variation-settings:'wdth' 112,'wght' 800;font-size:13.5px;
  letter-spacing:.1em;color:var(--neon);text-shadow:var(--glow);}
.minibar{display:block;height:3px;background:var(--iron);border-radius:99px;margin:7px 0 4px;max-width:150px;overflow:hidden;}
.minibar i{display:block;height:100%;background:var(--neon);border-radius:99px;}
.ladder .btnrow{margin-top:14px;}

@media (prefers-reduced-motion:reduce){
  .ring{animation:none!important;}
  .skx *{transition-duration:.01ms!important;animation-duration:.01ms!important;}
  .rise{opacity:1;transform:none;}
}
`;
