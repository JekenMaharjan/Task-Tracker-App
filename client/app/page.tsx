"use client";

import React, { useEffect, useState } from "react";
import "./globals.css";

const App = () => {
    const [tasks, setTasks] = useState<
        { id: number; title: string; dueDate: string; status: "pending" | "done" }[]
    >([]);
    const [newTask, setNewTask] = useState("");
    const [newDueDate, setNewDueDate] = useState("");
    const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

    const [editingTask, setEditingTask] = useState<{
        id: number;
        title: string;
        dueDate: string;
        status: "pending" | "done";
    } | null>(null);


    const filteredTasks = tasks.filter((task) => {
        if (filter === "all") return true;
        return task.status === filter;
    });

    const addTask = () => {
        if (!newTask.trim() || !newDueDate) return; // require title and date

        setTasks([
            ...tasks,
            {
                id: Date.now(),
                title: newTask,
                dueDate: newDueDate,
                status: "pending",
            },
        ]);

        setNewTask("");
        setNewDueDate("");
    };



    const deleteTask = (id:number) => {
        setTasks(tasks.filter((task) => task.id !== id));
    };

    const updateTask = () => {
        if (!editingTask) return;

        setTasks(
            tasks.map((task) =>
                task.id === editingTask.id ? editingTask : task
            )
        );

        setEditingTask(null); // close popup
    };

    useEffect(() => {
        const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
        setTasks(storedTasks);
    }, []);


    useEffect(() => {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    }, [tasks]);

    return (
        <div className="bg-blue-200 min-h-screen">
            <div className="bg-blue-400 text-white p-4 text-center">
                <p className="font-bold text-3xl">
                    React Task Tracker App
                </p>
                <p>Focus! Master your day, one task at a time.</p>
            </div>

            <div className="p-4 bg-white m-4 rounded shadow-md xs:w-md sm:w-2xl md:w-5xl lg:w-6xl mx-auto">
                <p className="p-2 text-center text-3xl font-bold text-blue-500">Tasks</p>
                <hr className="my-4 border-gray-300" />

                {/* Legend */}
                <div className="flex justify-between p-2 gap-x-10 text-sm">
                    <div className="relative w-full">
                        {/* Task Input */}
                        <input
                            type="text"
                            className="w-full border border-gray-300 rounded-full pl-4 pr-30 py-4 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400 transition"
                            placeholder="What's your next move?"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                        />

                        {/* Date picker with calendar icon */}
                        <div className="absolute top-1/2 right-30 -translate-y-1/2">
                            <span className="mr-5 text-gray-400 text-xs ">
                                {newDueDate && !isNaN(new Date(newDueDate).getTime())
                                    ? new Date(newDueDate).toLocaleString([], {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })
                                    : ""}
                            </span>
                            <span
                                className="cursor-pointer text-xl text-gray-500"
                                onClick={() => {
                                    const dateInput = document.getElementById("task-date") as HTMLInputElement;
                                    dateInput?.showPicker(); // open the date picker
                                }}
                            >
                                📅
                            </span>

                            <input
                                type="datetime-local"
                                id="task-date"
                                className="absolute opacity-0 w-0 h-10" // <--- updated here
                                value={newDueDate}
                                onChange={(e) => setNewDueDate(e.target.value)}
                            />
                        </div>

                        {/* Add Button */}
                        <button
                            onClick={addTask}
                            className="absolute top-1/2 right-0 pl-5 -translate-y-1/2 font-semibold text-[15px] bg-green-400 text-white px-6 py-4 rounded-l-none rounded-full cursor-pointer  hover:bg-green-500"
                        >
                            + Add
                        </button>
                    </div>

                    <div className="flex flex-col justify-center">
                        <div className="flex items-center gap-x-1">
                            <span className="inline-block w-4 h-4 rounded-full bg-green-200 border"></span>
                            <p>Done</p>
                        </div>
                        <div className="flex items-center gap-x-1">
                            <span className="inline-block w-4 h-4 rounded-full bg-yellow-200 border"></span>
                            <p>Pending</p>
                        </div>
                    </div>
                </div>

                {/* Filter tasks by status: */}
                <div>
                    <hr className="my-4 border-gray-300" />

                    <p className="text-sm text-center text-gray-600 mb-2">Filter tasks by status:</p>

                    <div className="flex justify-center gap-2 mb-4">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 cursor-pointer  py-2 rounded ${filter === "all" ? "bg-blue-400 text-white" : "bg-gray-200"
                                }`}
                        >
                            All
                        </button>

                        <button
                            onClick={() => setFilter("pending")}
                            className={`px-4 py-2 cursor-pointer rounded ${filter === "pending" ? "bg-yellow-400 text-white" : "bg-gray-200"
                                }`}
                        >
                            Pending
                        </button>

                        <button
                            onClick={() => setFilter("done")}
                            className={`px-4 py-2 cursor-pointer rounded ${filter === "done" ? "bg-green-400 text-white" : "bg-gray-200"
                                }`}
                        >
                            Done
                        </button>

                    </div>

                    <hr className="my-6 border-gray-300" />

                </div>

                {/* Task List */}
                {filteredTasks.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">
                        No tasks found.
                    </p>
                ) : (null)}

                {filteredTasks.map((task) => (
                    <div
                        key={task.id}
                        className={`p-3 m-2 rounded shadow-sm flex justify-between items-center transition-transform duration-200 ease-out hover:scale-105 ${task.status === "done" ? "bg-green-100 hover:bg-green-200" : "bg-yellow-100 hover:bg-yellow-200"
                            }`}
                    >
                        <div>
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-sm text-gray-600">
                                {new Date(task.dueDate).toLocaleString([], {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </p>
                        </div>

                        <div>
                            <span className="flex gap-x-2">
                                <button
                                    onClick={() => setEditingTask(task)}
                                    className="bg-blue-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-blue-500"
                                >
                                    Edit
                                </button>


                                <button
                                    onClick={() => deleteTask(task.id)}
                                    className="bg-red-400 text-white px-4 py-2 rounded cursor-pointer hover:bg-red-500"
                                >
                                    Delete
                                </button>
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit button -> PopUp UI */}
            {editingTask && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
                        <h2 className="text-xl font-bold mb-4 text-center">
                            Edit Task
                        </h2>

                        {/* Title */}
                        <input
                            type="text"
                            className="w-full border p-2 rounded mb-3"
                            value={editingTask.title}
                            onChange={(e) =>
                                setEditingTask({
                                    ...editingTask,
                                    title: e.target.value,
                                })
                            }
                        />

                        {/* Due Date */}
                        <input
                            type="datetime-local"
                            className="w-full border p-2 rounded mb-3"
                            value={editingTask.dueDate}
                            onChange={(e) =>
                                setEditingTask({
                                    ...editingTask,
                                    dueDate: e.target.value,
                                })
                            }
                        />


                        {/* Status */}
                        <select
                            className="w-full border p-2 rounded mb-4"
                            value={editingTask.status}
                            onChange={(e) =>
                                setEditingTask({
                                    ...editingTask,
                                    status: e.target.value as "pending" | "done",
                                })
                            }
                        >
                            <option value="pending">Pending</option>
                            <option value="done">Done</option>
                        </select>

                        {/* Buttons */}
                        <div className="flex justify-between">
                            <button
                                onClick={() => setEditingTask(null)}
                                className="bg-gray-300 cursor-pointer px-4 py-2 rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={updateTask}
                                className="bg-green-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default App;
