"use strict";

/**
 * @param {number[]} nums
 * @return {boolean}
 */
var canJump = function (nums) {
  let steps = 0;

  for (let i = 0; i < nums.length; i++) {
    if (i > steps) return false;

    if(steps < i + nums[i]) steps = i + nums[i];

    if (steps >= nums.length - 1) return true;
  }
};

console.log(canJump([2, 3, 1, 1, 4]));
console.log(canJump([3, 2, 1, 0, 4]));
