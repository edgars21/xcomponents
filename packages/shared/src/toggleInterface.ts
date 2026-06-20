
export type ToggleInterfaceConstructor = {
    toggled?: boolean;
}

export type ToggleInterfaceEvents = {
    onToggle: (toggled: boolean) => void;
}

export type ToggleInterfaceApi = {
    setToggled: (toggled: boolean) => void;
    toggle: () => void;
    isToggled: () => boolean;
}

export type ToggleInterface = {
    constructor: ToggleInterfaceConstructor;
    api: ToggleInterfaceApi;
    events: ToggleInterfaceEvents;
}