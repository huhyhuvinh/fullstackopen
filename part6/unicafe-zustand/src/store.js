import { create } from 'zustand'

const useFeedbackStore = create(set => ({
    statistics: {
        good: 0,
        neutral: 0,
        bad: 0,
    },
    actions: {
        rateGood: () => set(state => ({
            statistics: {
                ...state.statistics,
                good: state.statistics.good + 1
            }
        })),
        rateNeutral: () => set(state => ({
            statistics: {
                ...state.statistics,
                neutral: state.statistics.neutral + 1
            }
        })),
        rateBad: () => set(state => ({
            statistics: {
                ...state.statistics,
                bad: state.statistics.bad + 1
            }
        })),
    }
}))

export const useFeedback = () => useFeedbackStore(state => state.statistics)

export const useFeedbackControls = () => useFeedbackStore(state => state.actions)
