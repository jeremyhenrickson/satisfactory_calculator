import satisfactoryData from "./data.json" assert {type: "json"};
import { Recipe, RecipeResults, Machine, MachineResult, InputOutput, RecipeSearchResult } from "./interfaces";
import * as readlineSync from 'readline-sync';

function main() {
    console.log("Welcome to the Satisfactory janky calculator!");
    console.log("---------------------------------------------");

//    calculate("computer", 10);
//    calculate("automated wiring", 10);
//   calculate("adaptive control unit", 10);

    do {
     const item : string = readlineSync.question('What item? ');
        if(item === "quit") {
            console.log("bye");
            return
        }
        const quantity : string = readlineSync.question('How many per minute? ');
        calculate(item, +quantity);
    } while(true);
 }

function calculate(itemName: string, quantity: number) {
    var recipeSearchResult : RecipeSearchResult;
    var numRecipes : number;

    console.log("Starting search for " + quantity + " " + itemName + "(s)");

    recipeSearchResult = findRecipe(itemName);

    if(recipeSearchResult.recipe != undefined)  {
        var result = {"items": [], "machines": []};
        numRecipes = quantity / recipeSearchResult.outputPerRecipe;
        calculateAllItems(recipeSearchResult.recipe, numRecipes, result);
        console.log("Recipe found. Results:\n");
        console.log(resultsToString(result));
    } else {
        console.log("No recipe found for " + itemName);
    }
}

function calculateAllItems(recipe: Recipe, recipeRepetitions: number, result: RecipeResults) {
    var len = recipe.inputs.length;
    var i : number;
    var nextRecipeResult : RecipeSearchResult;
    var numNeeded : number;

    // add items to the list
    for(i=0; i < len; i++) {
        numNeeded = recipe.inputs[i].quantity * recipeRepetitions;
        addItem(recipe.inputs[i].item, numNeeded, result);
        nextRecipeResult = findRecipe(recipe.inputs[i].item);
        if(nextRecipeResult != undefined) {
            calculateAllItems(nextRecipeResult.recipe, numNeeded / nextRecipeResult.outputPerRecipe, result);
        }
    }

    // add the relevant machine to the list
    addMachines(recipe.machine.type, recipeRepetitions / recipe.machine.cyclesPerMinute, result);

}

function findRecipe(itemName: string) : RecipeSearchResult {
    // look for any recipe that contains the desired item name
    var recipe : Recipe = satisfactoryData.recipes.find(r => r.outputs.some(o => o.item === itemName));

    // if we don't find one, return undefined
    if(recipe === undefined) {
        return undefined;
    }

    // if we do find one, find the quantity of the item produced by that recipe
    var result : RecipeSearchResult = {"recipe": undefined, "outputPerRecipe": 0};
    var io : InputOutput = recipe.outputs.find(o => o.item === itemName);
    result.recipe = recipe;
    result.outputPerRecipe = io.quantity;

    return result;
}

function addItem(itemName: string, numNeeded: number, result: RecipeResults) {
    var itemInList : InputOutput = result.items.find(e => e.item === itemName);

    if(itemInList === undefined) {
        result.items.push({"item": itemName, "quantity": numNeeded});
    } else {
        itemInList.quantity = itemInList.quantity + numNeeded;
    }
}

function addMachines(machineType: string, numNeeded: number, result: RecipeResults) {
    var machineInList : MachineResult = result.machines.find(e => e.type === machineType);

    if(machineInList === undefined) {
        result.machines.push({"type": machineType, "quantity": numNeeded});
    } else {
        machineInList.quantity = machineInList.quantity + numNeeded;
    }
}

function resultsToString(result: RecipeResults) : string {
    var response : string = "";

    response += "Items\n-----\n";
    result.items.forEach(e => response += (e.item + ": " + e.quantity + "\n"));

    response += "\nMachines\n--------\n"
    result.machines.forEach(e => response += (e.type + ": " + e.quantity + "\n"));

    return response;
}


main();