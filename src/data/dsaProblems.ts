import type { DsaProblem } from '../types/course';

export const DSA_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack & Queue',
  'Binary Search',
  'Linked Lists',
  'Trees',
  'Graphs',
  'Dynamic Programming',
  'Heaps & Greedy',
] as const;

export const DSA_PROBLEMS: DsaProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    topic: 'Arrays & Hashing',
    difficulty: 'Easy',
    statement:
      'Given an array of integers nums and an integer target, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.',
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'nums[0] + nums[1] == 9, so return [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.',
    ],
    hints: [
      'A brute-force nested loop checks every pair in O(n^2) time. Can you trade space for O(n) lookup?',
      'For each number x, you need its complement (target - x). Store visited values and their indices in a hash map as you scan.',
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {\n  // Return [index1, index2]\n  \n}\n\nconsole.log(twoSum([2, 7, 11, 15], 9));`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    # Return [index1, index2]\n    pass\n\nprint(two_sum([2, 7, 11, 15], 9))`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Return indices\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Return indices\n    return {};\n}`,
    },
    solutions: {
      javascript: `function twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (seen.has(complement)) {\n      return [seen.get(complement), i];\n    }\n    seen.set(nums[i], i);\n  }\n  return [];\n}`,
      python: `def two_sum(nums: list[int], target: int) -> list[int]:\n    seen: dict[int, int] = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        Map<Integer, Integer> seen = new HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int complement = target - nums[i];\n            if (seen.containsKey(complement)) {\n                return new int[]{seen.get(complement), i};\n            }\n            seen.put(nums[i], i);\n        }\n        return new int[]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < (int)nums.size(); i++) {\n        int complement = target - nums[i];\n        if (seen.count(complement)) {\n            return {seen[complement], i};\n        }\n        seen[nums[i]] = i;\n    }\n    return {};\n}`,
    },
    timeComplexity: 'O(n) — single pass with O(1) average hash map lookup.',
    spaceComplexity: 'O(n) — stores up to n elements in the hash map.',
    approachNotes:
      'Checking for the complement before inserting the current value prevents reusing the same index when target == 2 * nums[i].',
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    topic: 'Arrays & Hashing',
    difficulty: 'Medium',
    statement:
      'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["eat","tea","ate"],["tan","nat"],["bat"]]',
      },
      {
        input: 'strs = [""]',
        output: '[[""]]',
      },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consists of lowercase English letters.',
    ],
    hints: [
      'Two strings are anagrams if and only if their sorted forms or 26-letter frequency counts are identical.',
      'Use a 26-element character count signature as the hash map key to achieve O(n * k) without sorting.',
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {\n  // Group strings sharing the same character counts\n  \n}`,
      python: `def group_anagrams(strs: list[str]) -> list[list[str]]:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    return {};\n}`,
    },
    solutions: {
      javascript: `function groupAnagrams(strs) {\n  const groups = new Map();\n  for (const s of strs) {\n    const counts = new Array(26).fill(0);\n    for (let i = 0; i < s.length; i++) {\n      counts[s.charCodeAt(i) - 97]++;\n    }\n    const key = counts.join('#');\n    if (!groups.has(key)) groups.set(key, []);\n    groups.get(key).push(s);\n  }\n  return Array.from(groups.values());\n}`,
      python: `from collections import defaultdict\n\ndef group_anagrams(strs: list[str]) -> list[list[str]]:\n    groups = defaultdict(list)\n    for s in strs:\n        counts = [0] * 26\n        for ch in s:\n            counts[ord(ch) - ord('a')] += 1\n        groups[tuple(counts)].append(s)\n    return list(groups.values())`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<String>> groupAnagrams(String[] strs) {\n        Map<String, List<String>> groups = new HashMap<>();\n        for (String s : strs) {\n            int[] counts = new int[26];\n            for (char c : s.toCharArray()) counts[c - 'a']++;\n            StringBuilder sb = new StringBuilder();\n            for (int n : counts) sb.append('#').append(n);\n            groups.computeIfAbsent(sb.toString(), k -> new ArrayList<>()).add(s);\n        }\n        return new ArrayList<>(groups.values());\n    }\n}`,
      cpp: `#include <vector>\n#include <string>\n#include <unordered_map>\nusing namespace std;\n\nvector<vector<string>> groupAnagrams(vector<string>& strs) {\n    unordered_map<string, vector<string>> groups;\n    for (const string& s : strs) {\n        int counts[26] = {0};\n        for (char c : s) counts[c - 'a']++;\n        string key;\n        for (int n : counts) key += '#' + to_string(n);\n        groups[key].push_back(s);\n    }\n    vector<vector<string>> res;\n    for (auto& [k, v] : groups) res.push_back(move(v));\n    return res;\n}`,
    },
    timeComplexity: 'O(n * k) where n is number of strings and k is max string length.',
    spaceComplexity: 'O(n * k) for storing the grouped strings and keys.',
    approachNotes:
      'Separating counts with a delimiter like "#" prevents collisions such as [1, 11] vs [11, 1].',
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    topic: 'Two Pointers',
    difficulty: 'Easy',
    statement:
      'Given a string s, return true if it is a palindrome after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, or false otherwise.',
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" reads the same forward and backward.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
      },
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    hints: [
      'Avoid allocating a filtered copy of the string if you want O(1) extra memory.',
      'Place left at index 0 and right at index n - 1, skipping non-alphanumeric characters on either side before comparing lowercase characters.',
    ],
    starterCode: {
      javascript: `function isPalindrome(s) {\n  // Two-pointer check in O(1) extra space\n  \n}`,
      python: `def is_palindrome(s: str) -> bool:\n    pass`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    return false;\n}`,
    },
    solutions: {
      javascript: `function isPalindrome(s) {\n  const isAlnum = (ch) => /[a-z0-9]/i.test(ch);\n  let left = 0, right = s.length - 1;\n  while (left < right) {\n    while (left < right && !isAlnum(s[left])) left++;\n    while (left < right && !isAlnum(s[right])) right--;\n    if (s[left].toLowerCase() !== s[right].toLowerCase()) return false;\n    left++;\n    right--;\n  }\n  return true;\n}`,
      python: `def is_palindrome(s: str) -> bool:\n    left, right = 0, len(s) - 1\n    while left < right:\n        while left < right and not s[left].isalnum():\n            left += 1\n        while left < right and not s[right].isalnum():\n            right -= 1\n        if s[left].lower() != s[right].lower():\n            return False\n        left += 1\n        right -= 1\n    return True`,
      java: `class Solution {\n    public boolean isPalindrome(String s) {\n        int left = 0, right = s.length() - 1;\n        while (left < right) {\n            while (left < right && !Character.isLetterOrDigit(s.charAt(left))) left++;\n            while (left < right && !Character.isLetterOrDigit(s.charAt(right))) right--;\n            if (Character.toLowerCase(s.charAt(left)) != Character.toLowerCase(s.charAt(right))) {\n                return false;\n            }\n            left++;\n            right--;\n        }\n        return true;\n    }\n}`,
      cpp: `#include <string>\n#include <cctype>\nusing namespace std;\n\nbool isPalindrome(string s) {\n    int left = 0, right = (int)s.size() - 1;\n    while (left < right) {\n        while (left < right && !isalnum((unsigned char)s[left])) left++;\n        while (left < right && !isalnum((unsigned char)s[right])) right--;\n        if (tolower((unsigned char)s[left]) != tolower((unsigned char)s[right])) return false;\n        left++;\n        right--;\n    }\n    return true;\n}`,
    },
    timeComplexity: 'O(n) — each character is inspected at most once.',
    spaceComplexity: 'O(1) — constant pointer variables only.',
    approachNotes:
      'In C++, always cast char to unsigned char before passing to isalnum/tolower to avoid undefined behavior on negative char values.',
  },
  {
    id: 'container-with-most-water',
    title: 'Container With Most Water',
    topic: 'Two Pointers',
    difficulty: 'Medium',
    statement:
      'You are given an integer array height of length n. Find two lines that together with the x-axis form a container holding the most water, and return the maximum area.',
    examples: [
      {
        input: 'height = [1, 8, 6, 2, 5, 4, 8, 3, 7]',
        output: '49',
        explanation: 'Lines at indices 1 (height 8) and 8 (height 7) yield min(8, 7) * (8 - 1) = 49.',
      },
    ],
    constraints: ['2 <= height.length <= 10^5', '0 <= height[i] <= 10^4'],
    hints: [
      'Start with the widest container (left = 0, right = n - 1).',
      'Moving the taller line inward can never increase the area because width decreases and the height is still capped by the shorter line. Always move the shorter pointer inward.',
    ],
    starterCode: {
      javascript: `function maxArea(height) {\n  // Two pointers shrinking from both ends\n  \n}`,
      python: `def max_area(height: list[int]) -> int:\n    pass`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function maxArea(height) {\n  let left = 0, right = height.length - 1, best = 0;\n  while (left < right) {\n    const area = Math.min(height[left], height[right]) * (right - left);\n    if (area > best) best = area;\n    if (height[left] < height[right]) left++;\n    else right--;\n  }\n  return best;\n}`,
      python: `def max_area(height: list[int]) -> int:\n    left, right, best = 0, len(height) - 1, 0\n    while left < right:\n        best = max(best, min(height[left], height[right]) * (right - left))\n        if height[left] < height[right]:\n            left += 1\n        else:\n            right -= 1\n    return best`,
      java: `class Solution {\n    public int maxArea(int[] height) {\n        int left = 0, right = height.length - 1, best = 0;\n        while (left < right) {\n            int h = Math.min(height[left], height[right]);\n            best = Math.max(best, h * (right - left));\n            if (height[left] < height[right]) left++;\n            else right--;\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint maxArea(vector<int>& height) {\n    int left = 0, right = (int)height.size() - 1, best = 0;\n    while (left < right) {\n        best = max(best, min(height[left], height[right]) * (right - left));\n        if (height[left] < height[right]) left++;\n        else right--;\n    }\n    return best;\n}`,
    },
    timeComplexity: 'O(n) — pointers move inward n - 1 total steps.',
    spaceComplexity: 'O(1) — constant extra variables.',
    approachNotes:
      'Greedy invariant proof: discarding the shorter side eliminates only pairs that are strictly narrower and cannot exceed the current limiting height.',
  },
  {
    id: 'best-time-to-buy-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    topic: 'Sliding Window',
    difficulty: 'Easy',
    statement:
      'Given an array prices where prices[i] is the stock price on day i, choose a single day to buy one stock and a future day to sell it to maximize profit. Return 0 if no profit is possible.',
    examples: [
      {
        input: 'prices = [7, 1, 5, 3, 6, 4]',
        output: '5',
        explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 5.',
      },
      {
        input: 'prices = [7, 6, 4, 3, 1]',
        output: '0',
      },
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: [
      'Track the minimum price seen so far as you scan left to right.',
      'At each day, compute price - minPrice and update maxProfit.',
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {\n  // Track running minimum price\n  \n}`,
      python: `def max_profit(prices: list[int]) -> int:\n    pass`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function maxProfit(prices) {\n  let minPrice = Infinity;\n  let best = 0;\n  for (const price of prices) {\n    if (price < minPrice) minPrice = price;\n    else if (price - minPrice > best) best = price - minPrice;\n  }\n  return best;\n}`,
      python: `def max_profit(prices: list[int]) -> int:\n    min_price = float('inf')\n    best = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        else:\n            best = max(best, price - min_price)\n    return best`,
      java: `class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int best = 0;\n        for (int price : prices) {\n            if (price < minPrice) minPrice = price;\n            else best = Math.max(best, price - minPrice);\n        }\n        return best;\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\n#include <climits>\nusing namespace std;\n\nint maxProfit(vector<int>& prices) {\n    int minPrice = INT_MAX, best = 0;\n    for (int price : prices) {\n        minPrice = min(minPrice, price);\n        best = max(best, price - minPrice);\n    }\n    return best;\n}`,
    },
    timeComplexity: 'O(n) — single linear scan.',
    spaceComplexity: 'O(1) — two scalar accumulators.',
    approachNotes:
      'Equivalent to a sliding window where the left pointer jumps to right whenever a cheaper buy price is discovered.',
  },
  {
    id: 'longest-substring-no-repeat',
    title: 'Longest Substring Without Repeating Characters',
    topic: 'Sliding Window',
    difficulty: 'Medium',
    statement:
      'Given a string s, find the length of the longest substring without duplicate characters.',
    examples: [
      {
        input: 's = "abcabcbb"',
        output: '3',
        explanation: 'The answer is "abc", with length 3.',
      },
      {
        input: 's = "pwwkew"',
        output: '3',
        explanation: 'The answer is "wke" (note "pwke" is a subsequence, not a substring).',
      },
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols, and spaces.'],
    hints: [
      'Maintain a sliding window [left, right] where every character is unique.',
      'Store the last seen index of each character in a map. When s[right] repeats inside the window, jump left to lastIndex[ch] + 1.',
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {\n  // Sliding window with last-seen index map\n  \n}`,
      python: `def length_of_longest_substring(s: str) -> int:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function lengthOfLongestSubstring(s) {\n  const lastSeen = new Map();\n  let left = 0, best = 0;\n  for (let right = 0; right < s.length; right++) {\n    const ch = s[right];\n    if (lastSeen.has(ch) && lastSeen.get(ch) >= left) {\n      left = lastSeen.get(ch) + 1;\n    }\n    lastSeen.set(ch, right);\n    best = Math.max(best, right - left + 1);\n  }\n  return best;\n}`,
      python: `def length_of_longest_substring(s: str) -> int:\n    last_seen: dict[str, int] = {}\n    left = 0\n    best = 0\n    for right, ch in enumerate(s):\n        if ch in last_seen and last_seen[ch] >= left:\n            left = last_seen[ch] + 1\n        last_seen[ch] = right\n        best = max(best, right - left + 1)\n    return best`,
      java: `import java.util.*;\n\nclass Solution {\n    public int lengthOfLongestSubstring(String s) {\n        Map<Character, Integer> lastSeen = new HashMap<>();\n        int left = 0, best = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char ch = s.charAt(right);\n            if (lastSeen.containsKey(ch) && lastSeen.get(ch) >= left) {\n                left = lastSeen.get(ch) + 1;\n            }\n            lastSeen.put(ch, right);\n            best = Math.max(best, right - left + 1);\n        }\n        return best;\n    }\n}`,
      cpp: `#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nint lengthOfLongestSubstring(string s) {\n    unordered_map<char, int> lastSeen;\n    int left = 0, best = 0;\n    for (int right = 0; right < (int)s.size(); right++) {\n        char ch = s[right];\n        if (lastSeen.count(ch) && lastSeen[ch] >= left) {\n            left = lastSeen[ch] + 1;\n        }\n        lastSeen[ch] = right;\n        best = max(best, right - left + 1);\n    }\n    return best;\n}`,
    },
    timeComplexity: 'O(n) — single forward scan with O(1) map updates.',
    spaceComplexity: 'O(min(n, m)) where m is the character set size.',
    approachNotes:
      'Checking lastSeen[ch] >= left ensures left never moves backward for stale duplicates outside the current window.',
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    topic: 'Stack & Queue',
    difficulty: 'Easy',
    statement:
      'Given a string s containing only the characters "(", ")", "{", "}", "[" and "]", determine if the input string is valid: open brackets must be closed by the same type and in the correct nesting order.',
    examples: [
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
      { input: 's = "([{}])"', output: 'true' },
    ],
    constraints: ['1 <= s.length <= 10^4'],
    hints: [
      'A stack naturally tracks the most recently opened bracket (LIFO).',
      'Push expected closing brackets or opening brackets onto the stack, and verify the stack is empty at the end.',
    ],
    starterCode: {
      javascript: `function isValid(s) {\n  // Use a stack for matching delimiters\n  \n}`,
      python: `def is_valid(s: str) -> bool:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        return false;\n    }\n}`,
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    return false;\n}`,
    },
    solutions: {
      javascript: `function isValid(s) {\n  const pairs = { ')': '(', ']': '[', '}': '{' };\n  const stack = [];\n  for (const ch of s) {\n    if (ch in pairs) {\n      if (stack.pop() !== pairs[ch]) return false;\n    } else {\n      stack.push(ch);\n    }\n  }\n  return stack.length === 0;\n}`,
      python: `def is_valid(s: str) -> bool:\n    pairs = {')': '(', ']': '[', '}': '{'}\n    stack: list[str] = []\n    for ch in s:\n        if ch in pairs:\n            if not stack or stack.pop() != pairs[ch]:\n                return False\n        else:\n            stack.append(ch)\n    return not stack`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        Deque<Character> stack = new ArrayDeque<>();\n        for (char c : s.toCharArray()) {\n            if (c == '(') stack.push(')');\n            else if (c == '[') stack.push(']');\n            else if (c == '{') stack.push('}');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}`,
      cpp: `#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == '(') st.push(')');\n        else if (c == '[') st.push(']');\n        else if (c == '{') st.push('}');\n        else {\n            if (st.empty() || st.top() != c) return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}`,
    },
    timeComplexity: 'O(n) — each character is pushed and popped at most once.',
    spaceComplexity: 'O(n) — worst case all characters are opening brackets.',
    approachNotes:
      'In Java, prefer ArrayDeque over the legacy synchronized Stack class for better performance.',
  },
  {
    id: 'daily-temperatures',
    title: 'Daily Temperatures',
    topic: 'Stack & Queue',
    difficulty: 'Medium',
    statement:
      'Given an array of daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after day i to get a warmer temperature. If no future warmer day exists, keep answer[i] = 0.',
    examples: [
      {
        input: 'temperatures = [73, 74, 75, 71, 69, 72, 76, 73]',
        output: '[1, 1, 4, 2, 1, 1, 0, 0]',
      },
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: [
      'Store unresolved day indices in a monotonically decreasing stack.',
      'Whenever the current temperature exceeds temperatures[stack.top()], pop the top index prev and set answer[prev] = i - prev.',
    ],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {\n  // Monotonic decreasing stack of indices\n  \n}`,
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        return new int[temperatures.length];\n    }\n}`,
      cpp: `#include <vector>\n#include <stack>\nusing namespace std;\n\nvector<int> dailyTemperatures(vector<int>& temperatures) {\n    return {};\n}`,
    },
    solutions: {
      javascript: `function dailyTemperatures(temperatures) {\n  const ans = new Array(temperatures.length).fill(0);\n  const stack = [];\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prev = stack.pop();\n      ans[prev] = i - prev;\n    }\n    stack.push(i);\n  }\n  return ans;\n}`,
      python: `def daily_temperatures(temperatures: list[int]) -> list[int]:\n    ans = [0] * len(temperatures)\n    stack: list[int] = []\n    for i, temp in enumerate(temperatures):\n        while stack and temp > temperatures[stack[-1]]:\n            prev = stack.pop()\n            ans[prev] = i - prev\n        stack.append(i)\n    return ans`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int[] ans = new int[temperatures.length];\n        Deque<Integer> stack = new ArrayDeque<>();\n        for (int i = 0; i < temperatures.length; i++) {\n            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n                int prev = stack.pop();\n                ans[prev] = i - prev;\n            }\n            stack.push(i);\n        }\n        return ans;\n    }\n}`,
      cpp: `#include <vector>\n#include <stack>\nusing namespace std;\n\nvector<int> dailyTemperatures(vector<int>& temperatures) {\n    vector<int> ans(temperatures.size(), 0);\n    stack<int> st;\n    for (int i = 0; i < (int)temperatures.size(); i++) {\n        while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n            int prev = st.top(); st.pop();\n            ans[prev] = i - prev;\n        }\n        st.push(i);\n    }\n    return ans;\n}`,
    },
    timeComplexity: 'O(n) — each index enters and leaves the stack at most once.',
    spaceComplexity: 'O(n) — monotonic stack storage in worst-case decreasing input.',
    approachNotes:
      'Monotonic stacks solve "next greater element" patterns in linear time instead of O(n^2).',
  },
  {
    id: 'binary-search-rotated',
    title: 'Search in Rotated Sorted Array',
    topic: 'Binary Search',
    difficulty: 'Medium',
    statement:
      'An integer array nums sorted in strictly ascending order is rotated at an unknown pivot. Given target, return its index in O(log n) runtime, or -1 if it is not present.',
    examples: [
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 0', output: '4' },
      { input: 'nums = [4, 5, 6, 7, 0, 1, 2], target = 3', output: '-1' },
    ],
    constraints: ['1 <= nums.length <= 5000', 'All values of nums are unique.'],
    hints: [
      'At any midpoint mid, at least one half — either [left..mid] or [mid..right] — is guaranteed to be strictly sorted.',
      'Check which half is sorted, then test whether target lies inside that sorted range to decide which half to discard.',
    ],
    starterCode: {
      javascript: `function search(nums, target) {\n  // O(log n) modified binary search\n  \n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    pass`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = left + ((right - left) >> 1);\n    if (nums[mid] === target) return mid;\n    if (nums[left] <= nums[mid]) {\n      if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n      else left = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n      else right = mid - 1;\n    }\n  }\n  return -1;\n}`,
      python: `def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        if nums[left] <= nums[mid]:\n            if nums[left] <= target < nums[mid]:\n                right = mid - 1\n            else:\n                left = mid + 1\n        else:\n            if nums[mid] < target <= nums[right]:\n                left = mid + 1\n            else:\n                right = mid - 1\n    return -1`,
      java: `class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[left] <= nums[mid]) {\n                if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n                else left = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n                else right = mid - 1;\n            }\n        }\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint search(vector<int>& nums, int target) {\n    int left = 0, right = (int)nums.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[left] <= nums[mid]) {\n            if (nums[left] <= target && target < nums[mid]) right = mid - 1;\n            else left = mid + 1;\n        } else {\n            if (nums[mid] < target && target <= nums[right]) left = mid + 1;\n            else right = mid - 1;\n        }\n    }\n    return -1;\n}`,
    },
    timeComplexity: 'O(log n) — halves the search space each iteration.',
    spaceComplexity: 'O(1) — iterative pointer search.',
    approachNotes:
      'Using <= in nums[left] <= nums[mid] properly handles the two-element subarray where left == mid.',
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    topic: 'Linked Lists',
    difficulty: 'Easy',
    statement:
      'Given the head of a singly linked list, reverse the list in-place and return the new head.',
    examples: [
      { input: 'head = [1, 2, 3, 4, 5]', output: '[5, 4, 3, 2, 1]' },
      { input: 'head = []', output: '[]' },
    ],
    constraints: ['The number of nodes is in the range [0, 5000].'],
    hints: [
      'Use three pointers: prev (initially null), curr (initially head), and nextTemp.',
      'Before rewriting curr.next = prev, save curr.next into nextTemp so you do not lose the rest of the list.',
    ],
    starterCode: {
      javascript: `function reverseList(head) {\n  // Iterative in-place pointer reversal\n  \n}`,
      python: `def reverse_list(head):\n    pass`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        return null;\n    }\n}`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    return nullptr;\n}`,
    },
    solutions: {
      javascript: `function reverseList(head) {\n  let prev = null;\n  let curr = head;\n  while (curr !== null) {\n    const nextTemp = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = nextTemp;\n  }\n  return prev;\n}`,
      python: `def reverse_list(head):\n    prev = None\n    curr = head\n    while curr:\n        next_temp = curr.next\n        curr.next = prev\n        prev = curr\n        curr = next_temp\n    return prev`,
      java: `class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode nextTemp = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = nextTemp;\n        }\n        return prev;\n    }\n}`,
      cpp: `ListNode* reverseList(ListNode* head) {\n    ListNode* prev = nullptr;\n    ListNode* curr = head;\n    while (curr != nullptr) {\n        ListNode* nextTemp = curr->next;\n        curr->next = prev;\n        prev = curr;\n        curr = nextTemp;\n    }\n    return prev;\n}`,
    },
    timeComplexity: 'O(n) — visits every node exactly once.',
    spaceComplexity: 'O(1) — iterative reversal uses constant stack memory.',
    approachNotes:
      'Prefer the iterative solution over recursion in production systems to avoid O(n) call stack usage on long lists.',
  },
  {
    id: 'lru-cache',
    title: 'Design LRU Cache',
    topic: 'Linked Lists',
    difficulty: 'Hard',
    statement:
      'Design a Least Recently Used (LRU) cache supporting get(key) and put(key, value) both in O(1) average time complexity. When capacity is exceeded, evict the least recently used key.',
    examples: [
      {
        input: 'LRUCache(2); put(1,1); put(2,2); get(1); put(3,3); get(2)',
        output: 'get(1) -> 1, get(2) -> -1 (evicted)',
      },
    ],
    constraints: ['1 <= capacity <= 3000', 'Both get and put must run in O(1) average time.'],
    hints: [
      'Hash maps give O(1) lookup by key, while a doubly linked list gives O(1) removal and move-to-front.',
      'In JavaScript, Map preserves insertion order; in Python, OrderedDict wraps a doubly linked list internally; in Java/C++, combine a HashMap with a sentinel doubly linked list.',
    ],
    starterCode: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n  }\n  get(key) {\n    return -1;\n  }\n  put(key, value) {\n    \n  }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n\n    def get(self, key: int) -> int:\n        return -1\n\n    def put(self, key: int, value: int) -> None:\n        pass`,
      java: `class LRUCache {\n    public LRUCache(int capacity) {}\n    public int get(int key) { return -1; }\n    public void put(int key, int value) {}\n}`,
      cpp: `class LRUCache {\npublic:\n    LRUCache(int capacity) {}\n    int get(int key) { return -1; }\n    void put(int key, int value) {}\n};`,
    },
    solutions: {
      javascript: `class LRUCache {\n  constructor(capacity) {\n    this.capacity = capacity;\n    this.cache = new Map();\n  }\n  get(key) {\n    if (!this.cache.has(key)) return -1;\n    const val = this.cache.get(key);\n    this.cache.delete(key);\n    this.cache.set(key, val);\n    return val;\n  }\n  put(key, value) {\n    if (this.cache.has(key)) this.cache.delete(key);\n    this.cache.set(key, value);\n    if (this.cache.size > this.capacity) {\n      const oldestKey = this.cache.keys().next().value;\n      this.cache.delete(oldestKey);\n    }\n  }\n}`,
      python: `from collections import OrderedDict\n\nclass LRUCache:\n    def __init__(self, capacity: int):\n        self.capacity = capacity\n        self.cache: OrderedDict[int, int] = OrderedDict()\n\n    def get(self, key: int) -> int:\n        if key not in self.cache:\n            return -1\n        self.cache.move_to_end(key)\n        return self.cache[key]\n\n    def put(self, key: int, value: int) -> None:\n        if key in self.cache:\n            self.cache.move_to_end(key)\n        self.cache[key] = value\n        if len(self.cache) > self.capacity:\n            self.cache.popitem(last=False)`,
      java: `import java.util.*;\n\nclass LRUCache extends LinkedHashMap<Integer, Integer> {\n    private final int capacity;\n    public LRUCache(int capacity) {\n        super(capacity, 0.75f, true);\n        this.capacity = capacity;\n    }\n    public int get(int key) {\n        return super.getOrDefault(key, -1);\n    }\n    @Override\n    protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {\n        return size() > capacity;\n    }\n}`,
      cpp: `#include <list>\n#include <unordered_map>\nusing namespace std;\n\nclass LRUCache {\n    int cap;\n    list<pair<int, int>> order;\n    unordered_map<int, list<pair<int, int>>::iterator> pos;\npublic:\n    LRUCache(int capacity) : cap(capacity) {}\n    int get(int key) {\n        auto it = pos.find(key);\n        if (it == pos.end()) return -1;\n        order.splice(order.begin(), order, it->second);\n        return it->second->second;\n    }\n    void put(int key, int value) {\n        auto it = pos.find(key);\n        if (it != pos.end()) {\n            it->second->second = value;\n            order.splice(order.begin(), order, it->second);\n            return;\n        }\n        if ((int)order.size() == cap) {\n            pos.erase(order.back().first);\n            order.pop_back();\n        }\n        order.emplace_front(key, value);\n        pos[key] = order.begin();\n    }\n};`,
    },
    timeComplexity: 'O(1) average for both get and put operations.',
    spaceComplexity: 'O(capacity) to store up to capacity entries.',
    approachNotes:
      'In interviews, be prepared to sketch the raw doubly linked list + hash map pointers even if your language has an ordered map built in.',
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    topic: 'Trees',
    difficulty: 'Medium',
    statement:
      'Given the root of a binary tree, determine if it is a valid binary search tree (BST): every node in the left subtree must be strictly less than the node, and every node in the right subtree strictly greater.',
    examples: [
      { input: 'root = [2, 1, 3]', output: 'true' },
      {
        input: 'root = [5, 1, 4, null, null, 3, 6]',
        output: 'false',
        explanation: 'Right child 4 is less than root 5.',
      },
    ],
    constraints: ['Number of nodes is in [1, 10^4]', '-2^31 <= Node.val <= 2^31 - 1'],
    hints: [
      'Checking only node.left.val < node.val < node.right.val is insufficient — a descendant deep in the right subtree could still be smaller than the root.',
      'Pass allowed (minBound, maxBound) bounds recursively down the tree, updating maxBound for left children and minBound for right children.',
    ],
    starterCode: {
      javascript: `function isValidBST(root) {\n  // DFS with exclusive (min, max) bounds\n  \n}`,
      python: `def is_valid_bst(root) -> bool:\n    pass`,
      java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return false;\n    }\n}`,
      cpp: `bool isValidBST(TreeNode* root) {\n    return false;\n}`,
    },
    solutions: {
      javascript: `function isValidBST(root) {\n  function dfs(node, low, high) {\n    if (!node) return true;\n    if (node.val <= low || node.val >= high) return false;\n    return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);\n  }\n  return dfs(root, -Infinity, Infinity);\n}`,
      python: `def is_valid_bst(root) -> bool:\n    def dfs(node, low, high):\n        if not node:\n            return True\n        if not (low < node.val < high):\n            return False\n        return dfs(node.left, low, node.val) and dfs(node.right, node.val, high)\n    return dfs(root, float('-inf'), float('inf'))`,
      java: `class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return dfs(root, Long.MIN_VALUE, Long.MAX_VALUE);\n    }\n    private boolean dfs(TreeNode node, long low, long high) {\n        if (node == null) return true;\n        if (node.val <= low || node.val >= high) return false;\n        return dfs(node.left, low, node.val) && dfs(node.right, node.val, high);\n    }\n}`,
      cpp: `#include <climits>\n\nbool dfs(TreeNode* node, long long low, long long high) {\n    if (!node) return true;\n    if (node->val <= low || node->val >= high) return false;\n    return dfs(node->left, low, node->val) && dfs(node->right, node->val, high);\n}\nbool isValidBST(TreeNode* root) {\n    return dfs(root, LLONG_MIN, LLONG_MAX);\n}`,
    },
    timeComplexity: 'O(n) — visits every tree node once.',
    spaceComplexity: 'O(h) — recursion depth equals tree height h (O(log n) balanced, O(n) skewed).',
    approachNotes:
      'Use 64-bit bounds (Long / long long) in Java and C++ so edge node values at INT_MIN or INT_MAX do not fail boundary comparisons.',
  },
  {
    id: 'level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    topic: 'Trees',
    difficulty: 'Medium',
    statement:
      'Given the root of a binary tree, return the level-by-level (breadth-first) traversal of its node values from left to right.',
    examples: [
      { input: 'root = [3, 9, 20, null, null, 15, 7]', output: '[[3], [9, 20], [15, 7]]' },
    ],
    constraints: ['Number of nodes is in [0, 2000].'],
    hints: [
      'Use a FIFO queue initialized with the root node.',
      'Capture levelSize = queue.length at the start of each level so you group nodes cleanly per depth.',
    ],
    starterCode: {
      javascript: `function levelOrder(root) {\n  // Breadth-first traversal using a queue\n  \n}`,
      python: `from collections import deque\n\ndef level_order(root) -> list[list[int]]:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        return new ArrayList<>();\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    return {};\n}`,
    },
    solutions: {
      javascript: `function levelOrder(root) {\n  if (!root) return [];\n  const result = [];\n  const queue = [root];\n  let head = 0;\n  while (head < queue.length) {\n    const levelSize = queue.length - head;\n    const level = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue[head++];\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    result.push(level);\n  }\n  return result;\n}`,
      python: `from collections import deque\n\ndef level_order(root) -> list[list[int]]:\n    if not root:\n        return []\n    result = []\n    queue = deque([root])\n    while queue:\n        level = []\n        for _ in range(len(queue)):\n            node = queue.popleft()\n            level.append(node.val)\n            if node.left:\n                queue.append(node.left)\n            if node.right:\n                queue.append(node.right)\n        result.append(level)\n    return result`,
      java: `import java.util.*;\n\nclass Solution {\n    public List<List<Integer>> levelOrder(TreeNode root) {\n        List<List<Integer>> result = new ArrayList<>();\n        if (root == null) return result;\n        Queue<TreeNode> queue = new ArrayDeque<>();\n        queue.offer(root);\n        while (!queue.isEmpty()) {\n            int size = queue.size();\n            List<Integer> level = new ArrayList<>(size);\n            for (int i = 0; i < size; i++) {\n                TreeNode node = queue.poll();\n                level.add(node.val);\n                if (node.left != null) queue.offer(node.left);\n                if (node.right != null) queue.offer(node.right);\n            }\n            result.add(level);\n        }\n        return result;\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nvector<vector<int>> levelOrder(TreeNode* root) {\n    vector<vector<int>> res;\n    if (!root) return res;\n    queue<TreeNode*> q;\n    q.push(root);\n    while (!q.empty()) {\n        int sz = (int)q.size();\n        vector<int> level;\n        level.reserve(sz);\n        for (int i = 0; i < sz; i++) {\n            TreeNode* node = q.front(); q.pop();\n            level.push_back(node->val);\n            if (node->left) q.push(node->left);\n            if (node->right) q.push(node->right);\n        }\n        res.push_back(move(level));\n    }\n    return res;\n}`,
    },
    timeComplexity: 'O(n) — every node is enqueued and dequeued once.',
    spaceComplexity: 'O(w) where w is the maximum width of the tree (up to n/2).',
    approachNotes:
      'Advancing a head index in JS avoids O(n) array.shift() cost on large trees.',
  },
  {
    id: 'number-of-islands',
    title: 'Number of Islands',
    topic: 'Graphs',
    difficulty: 'Medium',
    statement:
      'Given an m x n 2D binary grid representing land ("1") and water ("0"), return the number of distinct islands connected horizontally or vertically.',
    examples: [
      {
        input: 'grid = [["1","1","0"],["1","1","0"],["0","0","1"]]',
        output: '2',
      },
    ],
    constraints: ['1 <= m, n <= 300', 'grid[r][c] is "0" or "1".'],
    hints: [
      'Iterate over every cell. Whenever you encounter "1", increment the island count and flood-fill all connected land cells.',
      'Mark visited cells as "0" (or use a visited matrix if mutation is disallowed) to prevent double-counting.',
    ],
    starterCode: {
      javascript: `function numIslands(grid) {\n  // DFS or BFS connected components count\n  \n}`,
      python: `def num_islands(grid: list[list[str]]) -> int:\n    pass`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint numIslands(vector<vector<char>>& grid) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function numIslands(grid) {\n  const rows = grid.length, cols = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || c < 0 || r >= rows || c >= cols || grid[r][c] !== '1') return;\n    grid[r][c] = '0';\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < rows; r++) {\n    for (let c = 0; c < cols; c++) {\n      if (grid[r][c] === '1') {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}`,
      python: `def num_islands(grid: list[list[str]]) -> int:\n    rows, cols = len(grid), len(grid[0])\n    count = 0\n    def dfs(r: int, c: int) -> None:\n        if r < 0 or c < 0 or r >= rows or c >= cols or grid[r][c] != '1':\n            return\n        grid[r][c] = '0'\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n    for r in range(rows):\n        for c in range(cols):\n            if grid[r][c] == '1':\n                count += 1\n                dfs(r, c)\n    return count`,
      java: `class Solution {\n    public int numIslands(char[][] grid) {\n        int count = 0;\n        for (int r = 0; r < grid.length; r++) {\n            for (int c = 0; c < grid[0].length; c++) {\n                if (grid[r][c] == '1') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] g, int r, int c) {\n        if (r < 0 || c < 0 || r >= g.length || c >= g[0].length || g[r][c] != '1') return;\n        g[r][c] = '0';\n        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nvoid dfs(vector<vector<char>>& g, int r, int c) {\n    if (r < 0 || c < 0 || r >= (int)g.size() || c >= (int)g[0].size() || g[r][c] != '1') return;\n    g[r][c] = '0';\n    dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n}\nint numIslands(vector<vector<char>>& grid) {\n    int count = 0;\n    for (int r = 0; r < (int)grid.size(); r++) {\n        for (int c = 0; c < (int)grid[0].size(); c++) {\n            if (grid[r][c] == '1') {\n                count++;\n                dfs(grid, r, c);\n            }\n        }\n    }\n    return count;\n}`,
    },
    timeComplexity: 'O(m * n) — each cell is visited at most a constant number of times.',
    spaceComplexity: 'O(m * n) worst-case recursion depth if the entire grid is land.',
    approachNotes:
      'Use iterative BFS if stack depth on huge grids could cause stack overflow.',
  },
  {
    id: 'course-schedule',
    title: 'Course Schedule (Cycle Detection)',
    topic: 'Graphs',
    difficulty: 'Medium',
    statement:
      'There are numCourses labeled 0 to numCourses - 1. Given prerequisites where [a, b] means you must take course b before a, return true if you can finish all courses (i.e., the prerequisite graph has no cycle).',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1, 0]]', output: 'true' },
      { input: 'numCourses = 2, prerequisites = [[1, 0], [0, 1]]', output: 'false' },
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000'],
    hints: [
      'Model prerequisites as a directed graph b -> a and compute the in-degree of each node.',
      'Run Kahn’s topological sort (BFS starting from all 0-indegree nodes). If you process all numCourses nodes, the graph is acyclic.',
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  // Kahn's algorithm topological sort\n  \n}`,
      python: `from collections import deque\n\ndef can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        return false;\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nbool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    return false;\n}`,
    },
    solutions: {
      javascript: `function canFinish(numCourses, prerequisites) {\n  const adj = Array.from({ length: numCourses }, () => []);\n  const indegree = new Array(numCourses).fill(0);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    indegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (indegree[i] === 0) queue.push(i);\n  let completed = 0;\n  for (let head = 0; head < queue.length; head++) {\n    const node = queue[head];\n    completed++;\n    for (const next of adj[node]) {\n      if (--indegree[next] === 0) queue.push(next);\n    }\n  }\n  return completed === numCourses;\n}`,
      python: `from collections import deque\n\ndef can_finish(num_courses: int, prerequisites: list[list[int]]) -> bool:\n    adj = [[] for _ in range(num_courses)]\n    indegree = [0] * num_courses\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        indegree[course] += 1\n    queue = deque(i for i in range(num_courses) if indegree[i] == 0)\n    completed = 0\n    while queue:\n        node = queue.popleft()\n        completed += 1\n        for nxt in adj[node]:\n            indegree[nxt] -= 1\n            if indegree[nxt] == 0:\n                queue.append(nxt)\n    return completed == num_courses`,
      java: `import java.util.*;\n\nclass Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        List<List<Integer>> adj = new ArrayList<>();\n        for (int i = 0; i < numCourses; i++) adj.add(new ArrayList<>());\n        int[] indegree = new int[numCourses];\n        for (int[] p : prerequisites) {\n            adj.get(p[1]).add(p[0]);\n            indegree[p[0]]++;\n        }\n        Queue<Integer> q = new ArrayDeque<>();\n        for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.offer(i);\n        int completed = 0;\n        while (!q.isEmpty()) {\n            int cur = q.poll();\n            completed++;\n            for (int nxt : adj.get(cur)) {\n                if (--indegree[nxt] == 0) q.offer(nxt);\n            }\n        }\n        return completed == numCourses;\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nbool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n    vector<vector<int>> adj(numCourses);\n    vector<int> indegree(numCourses, 0);\n    for (const auto& p : prerequisites) {\n        adj[p[1]].push_back(p[0]);\n        indegree[p[0]]++;\n    }\n    queue<int> q;\n    for (int i = 0; i < numCourses; i++) if (indegree[i] == 0) q.push(i);\n    int completed = 0;\n    while (!q.empty()) {\n        int cur = q.front(); q.pop();\n        completed++;\n        for (int nxt : adj[cur]) if (--indegree[nxt] == 0) q.push(nxt);\n    }\n    return completed == numCourses;\n}`,
    },
    timeComplexity: 'O(V + E) where V is numCourses and E is prerequisites.length.',
    spaceComplexity: 'O(V + E) for the adjacency list and in-degree array.',
    approachNotes:
      'Kahn’s algorithm naturally extends to Course Schedule II by returning the popped order.',
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    topic: 'Dynamic Programming',
    difficulty: 'Easy',
    statement:
      'You are climbing a staircase that takes n steps to reach the top. Each time you can climb either 1 or 2 steps. Return how many distinct ways you can reach the top.',
    examples: [
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1.' },
      { input: 'n = 5', output: '8' },
    ],
    constraints: ['1 <= n <= 45'],
    hints: [
      'To reach step i, you must arrive from step i - 1 or step i - 2: ways(i) = ways(i - 1) + ways(i - 2).',
      'Only the previous two values are needed, reducing space from O(n) to O(1).',
    ],
    starterCode: {
      javascript: `function climbStairs(n) {\n  // Bottom-up DP with O(1) space\n  \n}`,
      python: `def climb_stairs(n: int) -> int:\n    pass`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        return 0;\n    }\n}`,
      cpp: `int climbStairs(int n) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const curr = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = curr;\n  }\n  return prev1;\n}`,
      python: `def climb_stairs(n: int) -> int:\n    if n <= 2:\n        return n\n    prev2, prev1 = 1, 2\n    for _ in range(3, n + 1):\n        prev2, prev1 = prev1, prev1 + prev2\n    return prev1`,
      java: `class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int prev2 = 1, prev1 = 2;\n        for (int i = 3; i <= n; i++) {\n            int curr = prev1 + prev2;\n            prev2 = prev1;\n            prev1 = curr;\n        }\n        return prev1;\n    }\n}`,
      cpp: `int climbStairs(int n) {\n    if (n <= 2) return n;\n    int prev2 = 1, prev1 = 2;\n    for (int i = 3; i <= n; i++) {\n        int curr = prev1 + prev2;\n        prev2 = prev1;\n        prev1 = curr;\n    }\n    return prev1;\n}`,
    },
    timeComplexity: 'O(n) — single loop up to n.',
    spaceComplexity: 'O(1) — rolling pair of integers.',
    approachNotes:
      'This recurrence is the Fibonacci sequence shifted by 1 index.',
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    topic: 'Dynamic Programming',
    difficulty: 'Medium',
    statement:
      'Given an array of coin denominations and a target amount, return the fewest number of coins needed to make up that amount. Return -1 if the amount cannot be formed.',
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    hints: [
      'Greedy selection of the largest coin fails on denominations like [1, 3, 4] for amount 6 (4+1+1 vs 3+3).',
      'Define dp[a] as the minimum coins needed for amount a, initialized to amount + 1 (sentinel infinity), with dp[0] = 0.',
    ],
    starterCode: {
      javascript: `function coinChange(coins, amount) {\n  // Unbounded knapsack bottom-up DP\n  \n}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        return -1;\n    }\n}`,
      cpp: `#include <vector>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    return -1;\n}`,
    },
    solutions: {
      javascript: `function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(amount + 1);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const coin of coins) {\n      if (coin <= a) {\n        dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n      }\n    }\n  }\n  return dp[amount] > amount ? -1 : dp[amount];\n}`,
      python: `def coin_change(coins: list[int], amount: int) -> int:\n    dp = [amount + 1] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for coin in coins:\n            if coin <= a:\n                dp[a] = min(dp[a], dp[a - coin] + 1)\n    return -1 if dp[amount] > amount else dp[amount]`,
      java: `import java.util.*;\n\nclass Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int coin : coins) {\n                if (coin <= a) {\n                    dp[a] = Math.min(dp[a], dp[a - coin] + 1);\n                }\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint coinChange(vector<int>& coins, int amount) {\n    vector<int> dp(amount + 1, amount + 1);\n    dp[0] = 0;\n    for (int a = 1; a <= amount; a++) {\n        for (int coin : coins) {\n            if (coin <= a) dp[a] = min(dp[a], dp[a - coin] + 1);\n        }\n    }\n    return dp[amount] > amount ? -1 : dp[amount];\n}`,
    },
    timeComplexity: 'O(amount * coins.length).',
    spaceComplexity: 'O(amount) for the 1D DP table.',
    approachNotes:
      'Initializing sentinel values to amount + 1 avoids integer overflow when adding 1.',
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    topic: 'Heaps & Greedy',
    difficulty: 'Medium',
    statement:
      'Given an array of intervals where intervals[i] = [start_i, end_i], merge all overlapping intervals and return an array of the non-overlapping intervals covering the same ranges.',
    examples: [
      {
        input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]',
        output: '[[1,6],[8,10],[15,18]]',
      },
    ],
    constraints: ['1 <= intervals.length <= 10^4', '0 <= start_i <= end_i <= 10^4'],
    hints: [
      'Sort intervals by their start value first so overlapping intervals become adjacent.',
      'Compare each interval’s start with the end of the last merged interval. If start <= lastEnd, extend lastEnd = max(lastEnd, end).',
    ],
    starterCode: {
      javascript: `function merge(intervals) {\n  // Sort by start time and merge overlaps\n  \n}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        return new int[][]{};\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    return {};\n}`,
    },
    solutions: {
      javascript: `function merge(intervals) {\n  intervals.sort((a, b) => a[0] - b[0]);\n  const merged = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = merged[merged.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      merged.push(intervals[i]);\n    }\n  }\n  return merged;\n}`,
      python: `def merge(intervals: list[list[int]]) -> list[list[int]]:\n    intervals.sort(key=lambda x: x[0])\n    merged = [intervals[0]]\n    for start, end in intervals[1:]:\n        if start <= merged[-1][1]:\n            merged[-1][1] = max(merged[-1][1], end)\n        else:\n            merged.append([start, end])\n    return merged`,
      java: `import java.util.*;\n\nclass Solution {\n    public int[][] merge(int[][] intervals) {\n        Arrays.sort(intervals, Comparator.comparingInt(a -> a[0]));\n        List<int[]> merged = new ArrayList<>();\n        for (int[] interval : intervals) {\n            if (merged.isEmpty() || merged.get(merged.size() - 1)[1] < interval[0]) {\n                merged.add(interval);\n            } else {\n                merged.get(merged.size() - 1)[1] = Math.max(merged.get(merged.size() - 1)[1], interval[1]);\n            }\n        }\n        return merged.toArray(new int[0][]);\n    }\n}`,
      cpp: `#include <vector>\n#include <algorithm>\nusing namespace std;\n\nvector<vector<int>> merge(vector<vector<int>>& intervals) {\n    sort(intervals.begin(), intervals.end());\n    vector<vector<int>> merged;\n    for (const auto& iv : intervals) {\n        if (merged.empty() || merged.back()[1] < iv[0]) merged.push_back(iv);\n        else merged.back()[1] = max(merged.back()[1], iv[1]);\n    }\n    return merged;\n}`,
    },
    timeComplexity: 'O(n log n) dominated by sorting.',
    spaceComplexity: 'O(n) for the output list (or O(log n) sort stack).',
    approachNotes:
      'Always take max(lastEnd, currentEnd) because one interval can be completely contained inside a previous wider interval.',
  },
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in an Array',
    topic: 'Heaps & Greedy',
    difficulty: 'Hard',
    statement:
      'Given an integer array nums and an integer k, return the kth largest element in the array (not the kth distinct element). Aim for better than O(n log n) time.',
    examples: [
      { input: 'nums = [3, 2, 1, 5, 6, 4], k = 2', output: '5' },
      { input: 'nums = [3, 2, 3, 1, 2, 4, 5, 5, 6], k = 4', output: '4' },
    ],
    constraints: ['1 <= k <= nums.length <= 10^5'],
    hints: [
      'A min-heap of fixed size k retains the k largest elements seen so far in O(n log k) time.',
      'Alternatively, Quickselect partitions around a random pivot to find the (n - k)th index in O(n) average time.',
    ],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {\n  // Quickselect or min-heap of size k\n  \n}`,
      python: `import heapq\n\ndef find_kth_largest(nums: list[int], k: int) -> int:\n    pass`,
      java: `import java.util.*;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        return 0;\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nint findKthLargest(vector<int>& nums, int k) {\n    return 0;\n}`,
    },
    solutions: {
      javascript: `function findKthLargest(nums, k) {\n  const target = nums.length - k;\n  function quickselect(left, right) {\n    const pivot = nums[right];\n    let p = left;\n    for (let i = left; i < right; i++) {\n      if (nums[i] <= pivot) {\n        [nums[p], nums[i]] = [nums[i], nums[p]];\n        p++;\n      }\n    }\n    [nums[p], nums[right]] = [nums[right], nums[p]];\n    if (p === target) return nums[p];\n    return p < target ? quickselect(p + 1, right) : quickselect(left, p - 1);\n  }\n  return quickselect(0, nums.length - 1);\n}`,
      python: `import heapq\n\ndef find_kth_largest(nums: list[int], k: int) -> int:\n    heap = nums[:k]\n    heapq.heapify(heap)\n    for num in nums[k:]:\n        if num > heap[0]:\n            heapq.heapreplace(heap, num)\n    return heap[0]`,
      java: `import java.util.*;\n\nclass Solution {\n    public int findKthLargest(int[] nums, int k) {\n        PriorityQueue<Integer> minHeap = new PriorityQueue<>(k + 1);\n        for (int n : nums) {\n            minHeap.offer(n);\n            if (minHeap.size() > k) minHeap.poll();\n        }\n        return minHeap.peek();\n    }\n}`,
      cpp: `#include <vector>\n#include <queue>\nusing namespace std;\n\nint findKthLargest(vector<int>& nums, int k) {\n    priority_queue<int, vector<int>, greater<int>> minHeap;\n    for (int n : nums) {\n        minHeap.push(n);\n        if ((int)minHeap.size() > k) minHeap.pop();\n    }\n    return minHeap.top();\n}`,
    },
    timeComplexity: 'O(n log k) for min-heap; O(n) average for Quickselect.',
    spaceComplexity: 'O(k) for the min-heap.',
    approachNotes:
      'In production streaming workloads where data arrives continuously, a size-k min-heap is superior because it never requires loading all elements into memory.',
  },
];
