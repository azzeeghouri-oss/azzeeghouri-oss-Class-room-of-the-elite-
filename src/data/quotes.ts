export interface QuoteCategory {
  default: string[];
  taskDone: string[];
  allTasksDone: string[];
  cleanChoice: string[];
  relapseChoice: string[];
  alarmTrigger: string[];
  streakMilestone: string[];
  codexPhilosophy: { title: string; content: string }[];
}

export const ayanokojiQuotes: QuoteCategory = {
  default: [
    "All people are nothing but tools. It doesn't matter what is sacrificed. As long as I win in the end, that's all that matters.",
    "Equality may be a mere fantasy, but our capacity to think and calculate is undeniable reality.",
    "I've never once thought of you as an ally. Not you. Not Kushida. Not Hirata. Everyone is a pawn.",
    "If you want to know what someone is truly capable of, strip away their comfort.",
    "Discipline isn't born from motivation. It is the cold execution of decisions already made.",
    "A failure once recognized and dissected is merely another variable accounted for.",
  ],
  taskDone: [
    "Task executed efficiently. Continue the calculation.",
    "Discipline is simply adhering to decisions already made. Next block.",
    "Good. No emotional hesitation. Maintain momentum.",
    "Execution without complaint. That is how the gap widens.",
    "One variable secured. Proceed to the next objective."
  ],
  allTasksDone: [
    "All daily tasks finished. Complete day protocol executed.",
    "Every single block checked off. That is the minimum expected standard in the White Room.",
    "Full execution verified. Flawless discipline today. Do not let pride compromise tomorrow.",
    "All objectives concluded. Total systematic dominance for today."
  ],
  cleanChoice: [
    "Impulses suppressed. The mind remains completely clear and uncompromised.",
    "Discipline intact. As long as you don't break your mental equilibrium, winning is certain.",
    "Rationality triumphs over primal urges. You retained your mental sovereignty today.",
    "Good. A master of self will never be enslaved by temporary dopamine."
  ],
  relapseChoice: [
    "Pathetic. You allowed a primal impulse to shatter your intellect.",
    "Relapse recorded. Weakness is a conscious choice. Do not dare fail tomorrow.",
    "You traded your pride and mental clarity for fleeting chemical release. Reset immediately.",
    "A flaw in the protocol. Dissect why you surrendered control, then eliminate that vulnerability."
  ],
  alarmTrigger: [
    "The mobile budget is exhausted. Put your phone down immediately.",
    "Screen time limit reached. Excessive consumption rots the calculating mind. Close it now.",
    "Time expired. Return to reality and execute your actual objectives."
  ],
  streakMilestone: [
    "Consistency compounds silently. Keep your victories hidden and execute relentlessly.",
    "The streak continues. Remember: complacency is the root of defeat."
  ],
  codexPhilosophy: [
    {
      title: "Principle of Absolute Utility",
      content: "Emotions are informational cues, not decision drivers. Assess every action, habit, and distraction by a single question: Does this elevate or degrade my objective?"
    },
    {
      title: "The Friction Calculus",
      content: "When faced with resistance, humans instinctively seek escape in cheap dopamine. Identify the friction point immediately, detach your ego, and dismantle the task piece by piece."
    },
    {
      title: "Preservation of Willpower",
      content: "Willpower is a finite daily resource. Eliminate unnecessary trivial choices. Fix your routine beforehand so execution requires zero deliberation."
    },
    {
      title: "Silence & Stealth",
      content: "Never advertise your goals or boast about your streaks. Let the results speak when the moment demands it. The strongest blade remains sheathed until the strike."
    }
  ]
};

export const defaultSchedule = [
  { id: '1', title: "Wake Up & Hydrate", time: "06:30 AM", done: false, category: "routine" as const },
  { id: '2', title: "Study Block 1 (Deep Work)", time: "09:00 AM - 11:30 AM", done: false, category: "study" as const },
  { id: '3', title: "Study Block 2 (Review & Practice)", time: "01:00 PM - 03:00 PM", done: false, category: "study" as const },
  { id: '4', title: "Ready for Academy", time: "03:00 PM - 03:30 PM", done: false, category: "routine" as const },
  { id: '5', title: "Academy Session (High Output)", time: "04:00 PM - 08:30 PM", done: false, category: "training" as const },
  { id: '6', title: "Sleep & Recovery Protocol", time: "10:30 PM", done: false, category: "recovery" as const }
];
