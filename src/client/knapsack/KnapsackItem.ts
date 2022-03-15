export default class KnapsackItem {
    /**
     * @param {Object} itemSettings - knapsack item settings,
     * @param {number} itemSettings.value - value of the item.
     * @param {number} itemSettings.weight - weight of the item.
     * @param {number} itemSettings.itemsInStock - how many items are available to be added.
     */

    value:number;
    weight:number;
    itemsInStock:number;
    quantity:number;
    object:any;

    constructor(value:number, weight:number, itemsInStock = 1, object:any ) {
      this.value = value;
      this.weight = weight;
      this.itemsInStock = itemsInStock;
      // Actual number of items that is going to be added to knapsack.
      this.quantity = 1;
      this.object = object;
    }
  
    get totalValue() {
      return this.value * this.quantity;
    }
  
    get totalWeight() {
      return this.weight * this.quantity;
    }
  
    // This coefficient shows how valuable the 1 unit of weight is
    // for current item.
    get valuePerWeightRatio() {
      return this.value / this.weight;
    }
  
    toString() {
      return `v${this.value} w${this.weight} x ${this.quantity}`;
    }
  }