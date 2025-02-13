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





}