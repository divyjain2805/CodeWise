require('dotenv').config();

const code = `import java.util.*;

class Main {
    public static int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> map = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        int complement = target - nums[i];
        if (map.containsKey(complement)) {
            return new int[]{map.get(complement), i};
        }
        map.put(nums[i], i);
    }
    return new int[]{};
}

    public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);
        int n = sc.nextInt();
        int[] nums = new int[n];
        for (int i = 0; i < n; i++) nums[i] = sc.nextInt();
        int target = sc.nextInt();

        int[] ans = twoSum(nums, target);
        System.out.println("[" + ans[0] + "," + ans[1] + "]");
    }
}`;

require('./src/services/jdoodle.service').executecode(code, 'java', '4', '4\n2 7 11 15\n9').then(console.log).catch(console.error);
