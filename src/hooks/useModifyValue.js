// import { useCallback, useContext } from "react";
// import { GameStateContext } from "../context/GameStateContext";

// export const useModifyValue = () => {
//   const { state, setState, config } = useContext(GameStateContext);

//   const modifyValue = useCallback(
//     ({ entityType, name, amount, options = {} }) => {
//       const entityMap = {
//         resource: {
//           state: state.resources,
//           setter: setState.setResources,
//           configList: config.resources,
//           valueKey: "current",
//         },
//         attribute: {
//           state: state.attributes,
//           setter: setState.setAttributes,
//           configList: config.attributes,
//           valueKey: "value",
//         },
//         score: {
//           state: state.scores,
//           setter: setState.setScores,
//           configList: config.scores,
//           valueKey: "value",
//         },
//         skill: {
//           state: state.skills,
//           setter: setState.setSkills,
//           configList: config.skills,
//           valueKey: "level",
//         },
//         stat: {
//           state: state.stats,
//           setter: setState.setStats,
//           configList: config.stats,
//           valueKey: "value",
//         },
//         equipment: {
//           state: state.equipment,
//           setter: setState.setEquipment,
//           configList: config.equipment,
//           valueKey: "equipped",
//         },
//       };

//       const entityInfo = entityMap[entityType];

//       if (!entityInfo) {
//         console.error(`Entity type "${entityType}" is not recognized.`);
//         return;
//       }

//       const { setter, configList, valueKey } = entityInfo;

//       setter((prevState) => {
//         const entity = prevState[name];

//         if (!entity) {
//           console.error(`"${name}" does not exist in ${entityType}s.`);
//           return prevState;
//         }

//         const entityConfig = configList.find((e) => e.name === name) || {};
//         const minValue = entityConfig.minValue ?? -Infinity;
//         const maxValue = entityConfig.maxValue ?? Infinity;

//         let currentValue = entity[valueKey];
//         let newValue = currentValue + amount;

//         if (options.maxAdjustment) {
//           const newMaxValue =
//             (entity.maxValue ?? maxValue) + options.maxAdjustment;
//           entity.maxValue = newMaxValue;
//           if (newValue > newMaxValue) {
//             newValue = newMaxValue;
//           }
//         }

//         newValue = Math.min(Math.max(newValue, minValue), maxValue);

//         console.log(
//           `Modified ${entityType} "${name}": ${currentValue} -> ${newValue}`
//         );

//         return {
//           ...prevState,
//           [name]: {
//             ...entity,
//             [valueKey]: newValue,
//           },
//         };
//       });
//     },
//     [state, setState, config]
//   );

//   return modifyValue;
// };
