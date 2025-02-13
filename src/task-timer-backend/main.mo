import Array "mo:base/Array";

actor TaskTimer {
  stable var tasks: [(Nat, Text, Int)] = [];
  var nextId: Nat = 0;

  // Add Task: create a new task with a unique Id
  public func addTask(name: Text) : async Nat {
    let taskId = nextId;
    nextId += 1;
    tasks := Array.append(tasks, [(taskId, name, 0)]);
    return taskId;
  };
  

  public func updateTaskTime(taskId: Nat, timeSpent: Int) : () {
  tasks := Array.map<(Nat, Text, Int), (Nat, Text, Int)>(tasks, func (task : (Nat, Text, Int)) : (Nat, Text, Int) {
    if (task.0 == taskId) {
      (task.0, task.1, task.2 + timeSpent)
    } else task
  });
};


// Get Tasks: Retrives all tasks
public query func getTasks() : async [(Nat, Text, Int)] {
  return tasks;
};


  // Delete Task: Removes a task 
  public func deleteTask(taskId: Nat) {
  tasks := Array.filter<(Nat, Text, Int)>(tasks, func (task : (Nat, Text, Int)) { task.0 != taskId });
};


//   public func deleteTask(taskId: Nat) : Bool {
//   let oldSize = tasks.size();
//   tasks := Array.filter(tasks, func (task) { task.0 != taskId });
//   return tasks.size() < oldSize;
// };
}