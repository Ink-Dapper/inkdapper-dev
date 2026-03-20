// Side Panel Utility Functions
const state = {
    startTime: null,
    isInitialized: false
};

export const initializeSidePanel = () => {
    try {
        if (!state.isInitialized) {
            state.startTime = Date.now();
            state.isInitialized = true;
        }
        return true;
    } catch (error) {
        console.error('Error initializing side panel:', error);
        return false;
    }
};

export const getSidePanelDuration = () => {
    try {
        if (!state.isInitialized || !state.startTime) {
            return 0;
        }
        return Date.now() - state.startTime;
    } catch (error) {
        console.error('Error getting side panel duration:', error);
        return 0;
    }
};

export const resetSidePanel = () => {
    try {
        state.startTime = null;
        state.isInitialized = false;
        return true;
    } catch (error) {
        console.error('Error resetting side panel:', error);
        return false;
    }
};

export const isSidePanelActive = () => {
    try {
        return state.isInitialized && state.startTime !== null;
    } catch (error) {
        console.error('Error checking side panel status:', error);
        return false;
    }
}; 