const express = require('express');
const fs = require("fs");
const path = require('path');
const app = express();
const https = require('https');
const PORT = 3000;
const bodyParser = require("body-parser");
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,           
   optionSuccessStatus:200,
}
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors(corsOptions)) 
app.use(express.json());
app.use(bodyParser.json());

const listFileName = "list.json";
let tasks = [];

// Check if list.json exists, and load tasks from it if available
if (fs.existsSync(listFileName)) {
    const data = fs.readFileSync(listFileName, "utf-8");
    tasks = JSON.parse(data);
} else {
    // If list.json doesn't exist, create it and add initial tasks
    tasks = [
        { text: "do the laundry", completed: false },
        { text: "do dishes", completed: true },
    ];
    fs.writeFileSync(listFileName, JSON.stringify(tasks, null, 2));
    console.log("list.json created with initial tasks");
}

// Define API endpoint to get tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

app.post("/api/tasks", (req, res) => {
    const taskText = req.body.taskText;
    if (taskText) {
        tasks.push({ text: taskText, completed: false });
        updateListFile();
        console.log(`Task added: ${taskText}`);
        res.status(201).json({ message: "Task added" });
    } else {
        res.status(400).json({ error: "Invalid task text" });
    }
});

app.put("/api/tasks/:index", (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = !tasks[index].completed;
        updateListFile();
        console.log(`Task updated: ${tasks[index].text}`);
        res.json({ message: "Task updated" });
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

app.delete("/api/tasks/:index", (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        const deletedTask = tasks.splice(index, 1);
        updateListFile();
        console.log(`Task removed: ${deletedTask[0].text}`);
        res.json({ message: "Task removed" });
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

app.put("/api/tasks/:index/completed", (req, res) => {
    const index = req.params.index;
    if (index >= 0 && index < tasks.length) {
        tasks[index].completed = req.body.completed;
        updateListFile();
        console.log(`Task completion status updated: ${tasks[index].text}`);
        res.json({ message: "Task completion status updated" });
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

function updateListFile() {
    fs.writeFileSync(listFileName, JSON.stringify(tasks, null, 2));
}


app.get('/getTimeByIP', async (req, res) => {
  try {
    const clientIP = req.query.ip;
    const response = await new Promise((resolve, reject) => {
      https.get(`https://timeapi.io/api/Time/current/ip?ipAddress=${clientIP}`, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          resolve(JSON.parse(data));
        });
      }).on('error', (err) => {
        reject(err);
      });
    });
    res.json(response);
  } catch (error) {
    console.error('Error fetching time:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
