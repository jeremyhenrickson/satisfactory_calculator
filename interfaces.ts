export interface InputOutput {
    item: string,
    quantity: number
}

export interface Machine {
    type: string,
    cyclesPerMinute: number
}

export interface Recipe {
    outputs: Array<InputOutput>,
    inputs: Array<InputOutput>,
    machine: Machine
}

export interface MachineResult {
    type: string,
    quantity: number
}

export interface RecipeResults {
    items: Array<InputOutput>,
    machines: Array<MachineResult>
}

export interface RecipeSearchResult {
    recipe: Recipe,
    outputPerRecipe: number
}