import { Test, TestCategory } from '../types/test';

export const demoTests: Test[] = [
  {
    id: 'fullstack-developer',
    title: 'Full-Stack Developer Assessment',
    category: 'coding',
    duration: 45,
    difficulty: 'Medium',
    description: 'Comprehensive evaluation of full-stack development skills including JavaScript, algorithms, async programming, and best practices.',
    skillsCovered: ['JavaScript', 'Algorithms', 'Async/Await', 'Problem Solving', 'Code Quality'],
    questions: [
      {
        id: 'fs-mcq-1',
        type: 'mcq',
        title: 'JavaScript Array Methods',
        description: 'Which array method should you use to transform each element in an array and return a new array with the transformed values?',
        points: 5,
        options: [
          'forEach()',
          'map()',
          'filter()',
          'reduce()'
        ],
        correctAnswer: 1
      },
      {
        id: 'fs-mcq-2',
        type: 'mcq',
        title: 'Async/Await Best Practices',
        description: 'What is the correct way to handle errors when using async/await?',
        points: 5,
        options: [
          'Use .catch() method',
          'Use try-catch blocks',
          'Check if result is undefined',
          'Use callback error parameter'
        ],
        correctAnswer: 1
      },
      {
        id: 'fs-mcq-3',
        type: 'mcq',
        title: 'RESTful API Design',
        description: 'Which HTTP method should be used to update a partial resource on the server?',
        points: 5,
        options: [
          'PUT',
          'POST',
          'PATCH',
          'UPDATE'
        ],
        correctAnswer: 2
      },
      {
        id: 'fs-code-1',
        type: 'coding',
        title: 'Array Manipulation',
        description: 'Write a function that takes an array of numbers and returns a new array containing only the even numbers, doubled. For example: [1, 2, 3, 4] should return [4, 8]',
        points: 15,
        language: 'javascript',
        starterCode: `function doubleEvens(numbers) {\n  // Your code here\n  \n}`,
        testCases: [
          {
            input: '[1, 2, 3, 4]',
            expectedOutput: '[4, 8]',
            hidden: false
          },
          {
            input: '[5, 10, 15, 20]',
            expectedOutput: '[20, 40]',
            hidden: false
          },
          {
            input: '[1, 3, 5, 7]',
            expectedOutput: '[]',
            hidden: true
          },
          {
            input: '[0, 2, 4, 6, 8]',
            expectedOutput: '[0, 4, 8, 12, 16]',
            hidden: true
          }
        ]
      },
      {
        id: 'fs-code-2',
        type: 'coding',
        title: 'Async Data Fetching',
        description: 'Write an async function that fetches user data and returns the user\'s name. Handle errors by returning "Error: " + error message. Assume fetchUser() is available and returns a promise.',
        points: 20,
        language: 'javascript',
        starterCode: `async function getUserName(userId) {\n  // Your code here\n  // Use: await fetchUser(userId)\n  // Returns: { name: "John Doe" }\n  \n}`,
        testCases: [
          {
            input: '1',
            expectedOutput: 'John Doe',
            hidden: false
          },
          {
            input: '2',
            expectedOutput: 'Jane Smith',
            hidden: false
          },
          {
            input: '999',
            expectedOutput: 'Error: User not found',
            hidden: true
          }
        ]
      },
      {
        id: 'fs-code-3',
        type: 'coding',
        title: 'Binary Search Algorithm',
        description: 'Implement a binary search function that returns the index of a target value in a sorted array, or -1 if not found.',
        points: 20,
        language: 'javascript',
        starterCode: `function binarySearch(arr, target) {\n  // Your code here\n  \n}`,
        testCases: [
          {
            input: '[1, 3, 5, 7, 9], 5',
            expectedOutput: '2',
            hidden: false
          },
          {
            input: '[1, 3, 5, 7, 9], 1',
            expectedOutput: '0',
            hidden: false
          },
          {
            input: '[1, 3, 5, 7, 9], 10',
            expectedOutput: '-1',
            hidden: true
          },
          {
            input: '[2, 4, 6, 8, 10, 12, 14], 12',
            expectedOutput: '5',
            hidden: true
          }
        ]
      },
      {
        id: 'fs-scenario-1',
        type: 'scenario',
        title: 'Production Bug Handling',
        description: 'You\'ve deployed a new feature to production and users are reporting intermittent 500 errors. The error logs show "Database connection timeout". What should be your first action?',
        points: 10,
        options: [
          'Immediately roll back the deployment',
          'Check database connection pool settings and current load',
          'Restart the application servers',
          'Ignore it since it\'s intermittent'
        ],
        correctAnswer: 1
      },
      {
        id: 'fs-scenario-2',
        type: 'scenario',
        title: 'Code Review Situation',
        description: 'During code review, you notice a colleague\'s code works correctly but uses nested callbacks 5 levels deep. What\'s the best approach?',
        points: 10,
        options: [
          'Approve it since it works',
          'Suggest refactoring to use Promises or async/await for better readability',
          'Reject the PR immediately',
          'Rewrite it yourself'
        ],
        correctAnswer: 1
      },
      {
        id: 'fs-code-4',
        type: 'coding',
        title: 'String Manipulation',
        description: 'Write a function that checks if a string is a palindrome (reads the same forwards and backwards). Ignore spaces and case.',
        points: 15,
        language: 'javascript',
        starterCode: `function isPalindrome(str) {\n  // Your code here\n  \n}`,
        testCases: [
          {
            input: '"racecar"',
            expectedOutput: 'true',
            hidden: false
          },
          {
            input: '"A man a plan a canal Panama"',
            expectedOutput: 'true',
            hidden: false
          },
          {
            input: '"hello"',
            expectedOutput: 'false',
            hidden: true
          },
          {
            input: '"Was it a car or a cat I saw"',
            expectedOutput: 'true',
            hidden: true
          }
        ]
      }
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Frontend Developer Assessment',
    category: 'coding',
    duration: 30,
    difficulty: 'Medium',
    description: 'Evaluate React, JavaScript, CSS, and frontend development skills.',
    skillsCovered: ['React', 'JavaScript', 'CSS', 'HTML', 'Component Design'],
    questions: [
      {
        id: 'fe-mcq-1',
        type: 'mcq',
        title: 'React Hooks',
        description: 'Which React hook should you use to perform side effects like data fetching?',
        points: 5,
        options: [
          'useState',
          'useEffect',
          'useContext',
          'useMemo'
        ],
        correctAnswer: 1
      },
      {
        id: 'fe-mcq-2',
        type: 'mcq',
        title: 'CSS Flexbox',
        description: 'Which CSS property is used to center items along the cross axis in a flex container?',
        points: 5,
        options: [
          'justify-content',
          'align-items',
          'align-content',
          'flex-direction'
        ],
        correctAnswer: 1
      },
      {
        id: 'fe-mcq-3',
        type: 'mcq',
        title: 'JavaScript Event Handling',
        description: 'What is event bubbling in JavaScript?',
        points: 5,
        options: [
          'Events fire from child to parent elements',
          'Events fire from parent to child elements',
          'Events fire only on the target element',
          'Events fire asynchronously'
        ],
        correctAnswer: 0
      },
      {
        id: 'fe-mcq-4',
        type: 'mcq',
        title: 'Responsive Design',
        description: 'Which CSS unit is best for responsive typography?',
        points: 5,
        options: [
          'px',
          'em',
          'rem',
          'pt'
        ],
        correctAnswer: 2
      },
      {
        id: 'fe-code-1',
        type: 'coding',
        title: 'React Component State',
        description: 'Create a simple React counter component that increments a count when a button is clicked. Return the JSX with a button and display of the count.',
        points: 15,
        language: 'javascript',
        starterCode: `function Counter() {\n  // Your code here\n  // Use useState to manage count\n  \n}`,
        testCases: [
          {
            input: 'initial',
            expectedOutput: 'count: 0',
            hidden: false
          },
          {
            input: 'after 1 click',
            expectedOutput: 'count: 1',
            hidden: false
          },
          {
            input: 'after 5 clicks',
            expectedOutput: 'count: 5',
            hidden: true
          }
        ]
      },
      {
        id: 'fe-code-2',
        type: 'coding',
        title: 'Array Filtering',
        description: 'Write a function that filters an array of objects to return only items where age is greater than or equal to 18.',
        points: 15,
        language: 'javascript',
        starterCode: `function filterAdults(people) {\n  // people = [{ name: "John", age: 25 }, { name: "Jane", age: 17 }]\n  // Your code here\n  \n}`,
        testCases: [
          {
            input: '[{ name: "John", age: 25 }, { name: "Jane", age: 17 }]',
            expectedOutput: '[{ name: "John", age: 25 }]',
            hidden: false
          },
          {
            input: '[{ name: "Alice", age: 30 }, { name: "Bob", age: 18 }]',
            expectedOutput: '[{ name: "Alice", age: 30 }, { name: "Bob", age: 18 }]',
            hidden: true
          }
        ]
      },
      {
        id: 'fe-code-3',
        type: 'coding',
        title: 'DOM Manipulation',
        description: 'Write a function that takes an array of strings and returns an HTML string of an unordered list with those items.',
        points: 15,
        language: 'javascript',
        starterCode: `function createList(items) {\n  // items = ["apple", "banana", "orange"]\n  // Return: "<ul><li>apple</li><li>banana</li><li>orange</li></ul>"\n  \n}`,
        testCases: [
          {
            input: '["apple", "banana"]',
            expectedOutput: '<ul><li>apple</li><li>banana</li></ul>',
            hidden: false
          },
          {
            input: '["one", "two", "three"]',
            expectedOutput: '<ul><li>one</li><li>two</li><li>three</li></ul>',
            hidden: true
          }
        ]
      },
      {
        id: 'fe-scenario-1',
        type: 'scenario',
        title: 'Performance Optimization',
        description: 'Your React app is re-rendering too frequently causing performance issues. What should you try first?',
        points: 10,
        options: [
          'Use React.memo to memoize components',
          'Rewrite the entire app',
          'Add more setTimeout calls',
          'Remove all state management'
        ],
        correctAnswer: 0
      },
      {
        id: 'fe-scenario-2',
        type: 'scenario',
        title: 'Accessibility Issue',
        description: 'A user reports they cannot navigate your form using keyboard only. What\'s the most likely issue?',
        points: 10,
        options: [
          'Missing ARIA labels',
          'Incorrect tab index or focus management',
          'CSS styling problems',
          'JavaScript is disabled'
        ],
        correctAnswer: 1
      },
      {
        id: 'fe-scenario-3',
        type: 'scenario',
        title: 'Responsive Design Decision',
        description: 'You need to hide a sidebar on mobile devices. What\'s the best CSS approach?',
        points: 10,
        options: [
          'Use display: none with JavaScript',
          'Use media queries to hide at small breakpoints',
          'Use visibility: hidden',
          'Remove it from the DOM with JavaScript'
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 'problem-solving',
    title: 'Problem Solving & Logic Assessment',
    category: 'cognitive',
    duration: 25,
    difficulty: 'Medium',
    description: 'Test cognitive abilities, logical reasoning, pattern recognition, and algorithmic thinking.',
    skillsCovered: ['Logic', 'Pattern Recognition', 'Algorithms', 'Critical Thinking'],
    questions: [
      {
        id: 'ps-mcq-1',
        type: 'mcq',
        title: 'Number Pattern',
        description: 'What number comes next in this sequence? 2, 4, 8, 16, 32, ?',
        points: 5,
        options: ['48', '64', '52', '60'],
        correctAnswer: 1
      },
      {
        id: 'ps-mcq-2',
        type: 'mcq',
        title: 'Logic Puzzle',
        description: 'If all Bloops are Razzies and all Razzies are Lazzies, then all Bloops are definitely Lazzies?',
        points: 5,
        options: ['True', 'False', 'Cannot be determined', 'Sometimes true'],
        correctAnswer: 0
      },
      {
        id: 'ps-mcq-3',
        type: 'mcq',
        title: 'Time Complexity',
        description: 'What is the time complexity of binary search on a sorted array of size n?',
        points: 5,
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correctAnswer: 1
      },
      {
        id: 'ps-mcq-4',
        type: 'mcq',
        title: 'Data Structure Selection',
        description: 'Which data structure is most efficient for implementing a browser\'s back button?',
        points: 5,
        options: ['Queue', 'Stack', 'Array', 'Linked List'],
        correctAnswer: 1
      },
      {
        id: 'ps-mcq-5',
        type: 'mcq',
        title: 'Pattern Recognition',
        description: 'Which word doesn\'t belong? Apple, Banana, Carrot, Orange, Grape',
        points: 5,
        options: ['Apple', 'Banana', 'Carrot', 'Orange'],
        correctAnswer: 2
      },
      {
        id: 'ps-mcq-6',
        type: 'mcq',
        title: 'Logical Reasoning',
        description: 'If it takes 5 machines 5 minutes to make 5 widgets, how long would it take 100 machines to make 100 widgets?',
        points: 5,
        options: ['5 minutes', '20 minutes', '100 minutes', '1 minute'],
        correctAnswer: 0
      },
      {
        id: 'ps-mcq-7',
        type: 'mcq',
        title: 'Algorithm Analysis',
        description: 'Which sorting algorithm has the best average-case time complexity?',
        points: 5,
        options: ['Bubble Sort', 'Quick Sort', 'Selection Sort', 'Insertion Sort'],
        correctAnswer: 1
      },
      {
        id: 'ps-mcq-8',
        type: 'mcq',
        title: 'Problem Decomposition',
        description: 'What is the first step in solving a complex programming problem?',
        points: 5,
        options: [
          'Start coding immediately',
          'Break it down into smaller sub-problems',
          'Look for existing solutions online',
          'Choose a programming language'
        ],
        correctAnswer: 1
      },
      {
        id: 'ps-code-1',
        type: 'coding',
        title: 'FizzBuzz',
        description: 'Write a function that returns "Fizz" if a number is divisible by 3, "Buzz" if divisible by 5, "FizzBuzz" if divisible by both, or the number as a string otherwise.',
        points: 20,
        language: 'javascript',
        starterCode: `function fizzBuzz(n) {\n  // Your code here\n  \n}`,
        testCases: [
          { input: '3', expectedOutput: 'Fizz', hidden: false },
          { input: '5', expectedOutput: 'Buzz', hidden: false },
          { input: '15', expectedOutput: 'FizzBuzz', hidden: false },
          { input: '7', expectedOutput: '7', hidden: true },
          { input: '30', expectedOutput: 'FizzBuzz', hidden: true }
        ]
      },
      {
        id: 'ps-code-2',
        type: 'coding',
        title: 'Find Maximum',
        description: 'Write a function that finds the maximum number in an array without using Math.max().',
        points: 20,
        language: 'javascript',
        starterCode: `function findMax(numbers) {\n  // Your code here\n  \n}`,
        testCases: [
          { input: '[1, 5, 3, 9, 2]', expectedOutput: '9', hidden: false },
          { input: '[10, 20, 5]', expectedOutput: '20', hidden: false },
          { input: '[-5, -1, -10]', expectedOutput: '-1', hidden: true },
          { input: '[100]', expectedOutput: '100', hidden: true }
        ]
      }
    ]
  }
];

export function getTestById(id: string): Test | undefined {
  return demoTests.find(test => test.id === id);
}

export function getTestsByCategory(category: TestCategory): Test[] {
  return demoTests.filter(test => test.category === category);
}
