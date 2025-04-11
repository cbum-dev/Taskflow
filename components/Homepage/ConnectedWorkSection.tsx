import React from 'react'

function ConnectedWorkSection() {
    return (
      <section className="py-16 px-4 w-full relative bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">It's a connected task</h2>
              <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-4">
                  <span className="font-medium">Game: Status</span>
                  <span className="text-sm text-gray-500">Subtasks</span>
                </div>
                <p className="mb-4 text-gray-600 dark:text-gray-300">It's a connected task.</p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>OPEN 1 ...</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>Name</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <input type="checkbox" className="rounded text-blue-500" />
                    <span>Magic Task</span>
                  </li>
                </ul>
                <div className="flex gap-2 text-sm">
                  <button className="text-blue-500 hover:text-blue-600">+ Add Task</button>
                  <button className="text-blue-500 hover:text-blue-600">+ New status</button>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-4">Connected Tasks</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Tasks aren't just tasks—they're connected. Link them to docs, chat, whiteboards, and projects so work flows effortlessly.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-bold mb-2">Connected Docs</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Embed documents directly in tasks</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-bold mb-2">Connected Chat</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Discuss tasks without leaving the app</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }
export default ConnectedWorkSection