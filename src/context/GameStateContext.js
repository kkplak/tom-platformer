// import React, { createContext, useState } from "react";

// // Create the context
// export const GameStateContext = createContext();

// export const GameStateProvider = ({ children }) => {
//   const [resources, setResources] = useState({
//     fuel: { current: 100, maxValue: 100 },
//   });

//   const [attributes, setAttributes] = useState({
//     speed: { value: 10, maxValue: 20 },
//   });

//   const [scores, setScores] = useState({
//     orbPoints: { value: 0 },
//   });

//   const [skills, setSkills] = useState({
//     jump: { level: 1 },
//   });

//   const [stats, setStats] = useState({
//     highScore: { value: 0 },
//   });

//   const [equipment, setEquipment] = useState({
//     jetpack: { equipped: false },
//   });

//   const config = {
//     resources: [{ name: "fuel", minValue: 0, maxValue: 100 }],
//     attributes: [{ name: "speed", minValue: 0, maxValue: 20 }],
//     scores: [{ name: "orbPoints", minValue: 0 }],
//     skills: [{ name: "jump", minValue: 1, maxValue: 5 }],
//     stats: [{ name: "highScore", minValue: 0 }],
//     equipment: [{ name: "jetpack" }],
//   };

//   return (
//     <GameStateContext.Provider
//       value={{
//         state: { resources, attributes, scores, skills, stats, equipment },
//         setState: {
//           setResources,
//           setAttributes,
//           setScores,
//           setSkills,
//           setStats,
//           setEquipment,
//         },
//         config,
//       }}
//     >
//       {children}
//     </GameStateContext.Provider>
//   );
// };
