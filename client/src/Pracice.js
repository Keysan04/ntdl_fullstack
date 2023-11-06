import { useEffect, useState } from "react";
import "./App.css";
import {
  deleteTasks,
  getAllTasks,
  postData,
  updateTasks,
} from "./Helper/axiosHelper";

const hoursWk = 24 * 7;

const initialState = {
  task: "",
  hr: "",
};

function App() {
  const [form, setForm] = useState(initialState);
  const [taskList, setTaskList] = useState([]);
  const [resp, setResp] = useState({});
  const [idsToDelete, setIdsToDelete] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const totalHrs = taskList.reduce((acc, item) => acc + +item.hr, 0);
  const [textVal, setTextVal] = useState(false);

  useEffect(() => {
    getTasks();
  }, []);

  const getTasks = async () => {
    const data = await getAllTasks();
    console.log(data);
    data.status === "success" && setTaskList(data.taskList);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    resp?.message && setResp({});

    setForm({
      ...form,
      [name]: value,
    });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (totalHrs + +form.hr > hoursWk) {
      return alert("Sorry boss not enough time left to fit this task");
    }

    // send data to the database
    const data = await postData(form);
    setResp(data);

    if (data.status === "success") {
      //reset the form
      setForm(initialState);

      //call api to fetch all the task
      getTasks();
    }
  };

  const handleOnDelte = async () => {
    if (
      window.confirm(
        `Are you sure you want to delete  ${idsToDelete.length} tasks?`
      )
    ) {
      //calling api to delte the data

      const result = await deleteTasks({ ids: idsToDelete });
      setResp(result);
      //fetching api to pull all the data

      result?.status === "success" && getTasks() && setIdsToDelete([]);
    }
    setSelectAll(!selectAll);
  };

  //collect ids of selectd task
  const handleOnChecked = (e) => {
    const { checked, value } = e.target;

    // take out from idsToDelete
    const temArg = idsToDelete.filter((itm) => itm !== value);

    if (checked) {
      //push in to idsToDelete
      temArg.push(value);
    }
    setIdsToDelete(temArg);
  };
  const handleSelectAll = (e) => {
    const { checked, value } = e.target;
    console.log(checked, value);
    if (selectAll) {
      setIdsToDelete([]);
    } else {
      const allItemIds = entry.map((item) => item._id);
      setIdsToDelete(allItemIds);
    }
    setTextVal(false);
    setSelectAll(!selectAll);
  };

  const handleSelectAllBad = (e) => {
    const { checked, value } = e.target;
    console.log(checked, value);
    if (selectAll) {
      setIdsToDelete([]);
    } else {
      const allItemIds = bad.map((item) => item._id);
      setIdsToDelete(allItemIds);
    }
    setTextVal(true);

    setSelectAll(!selectAll);
  };

  const switchTask = async (obj) => {
    //send update to the server

    const result = await updateTasks(obj);
    setResp(result);

    //if success, fetch all the data
    result.status === "success" && getTasks();
  };

  const entry = taskList.filter((item) => item.type === "entry");
  const bad = taskList.filter((item) => item.type === "bad");

  return (
    <div class="wrapper">
      <div class="container">
        {/* <!-- top title  --> */}
        <div class="row g-2">
          <div class="col mt-5 text-center">
            <h1>Not to do list</h1>
          </div>
        </div>

        {/* show the server message  */}

        {resp?.message && (
          <div
            className={
              resp?.status === "success"
                ? "alert alert-success"
                : "alert alert-danger"
            }
          >
            {resp?.message}
          </div>
        )}

        {/* <!-- form  --> */}
        <form
          onSubmit={handleOnSubmit}
          class="mt-5 border p-5 rounded shadow-lg bg-transparent"
        >
          <div class="row g-2">
            <div class="col-md-6">
              <input
                type="text"
                class="form-control"
                placeholder="Coding.."
                aria-label="First name"
                name="task"
                value={form.task}
                required
                onChange={handleOnChange}
              />
            </div>
            <div class="col-md-3">
              <input
                type="number"
                min="1"
                class="form-control"
                placeholder="23"
                aria-label="Last name"
                name="hr"
                value={form.hr}
                required
                onChange={handleOnChange}
              />
            </div>
            <div class="col-md-3">
              <div class="d-grid">
                <button class="btn btn-primary">Add Task</button>
              </div>
            </div>
          </div>
        </form>

        {/* <!-- table area  --> */}
        <div class="row mt-5 pt-2">
          {/* <!-- 1. entry list --> */}
          <div class="col-md">
            <h3 class="text-center">Task Entry List</h3>
            <hr />
            <div class="row-md-2 text-center">
              {taskList?.length > 0 && (
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  class="form-check-input"
                />
              )}
              <label>Select All</label>
            </div>
            <table class="table table-striped table-hover border opacity">
              <tbody id="entry">
                {entry.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>
                      {" "}
                      <input
                        type="checkbox"
                        value={item._id}
                        checked={idsToDelete.includes(item._id)}
                        onChange={handleOnChecked}
                        class="form-check-input"
                      />{" "}
                      {item.task}
                    </td>
                    <td>{item.hr}hr</td>
                    <td class="text-end">
                      {/* <button
                        onClick={() => handleOnDelte(item._id, item.task)}
                        class="btn btn-danger"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button>{" "} */}
                      <button
                        onClick={() =>
                          switchTask({ _id: item._id, type: "bad" })
                        }
                        class="btn btn-success"
                      >
                        <i class="fa-solid fa-arrow-right"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* <!-- 2. bad list  --> */}
          <div class="col-md">
            <h3 class="text-center">Bad List</h3>
            <hr />
            <div class="row-md-2 text-center">
              {bad?.length > 0 && (
                <input
                  type="checkbox"
                  onChange={handleSelectAllBad}
                  class="form-check-input"
                />
              )}
              <label>Select All</label>
            </div>
            <table class="table table-striped table-hover border opacity">
              <tbody id="bad">
                {bad.map((item, i) => (
                  <tr key={item._id}>
                    <td>{i + 1}</td>
                    <td>
                      <input
                        type="checkbox"
                        value={item._id}
                        checked={idsToDelete.includes(item._id)}
                        onChange={handleOnChecked}
                        class="form-check-input"
                      />{" "}
                      {item.task}
                    </td>
                    <td>{item.hr}hr</td>
                    <td class="text-end">
                      <button
                        onClick={() =>
                          switchTask({ _id: item._id, type: "entry" })
                        }
                        class="btn btn-warning"
                      >
                        <i class="fa-solid fa-arrow-left"></i>
                      </button>{" "}
                      {/* <button
                        onClick={() => handleOnDelte(item._id, item.task)}
                        class="btn btn-danger"
                      >
                        <i class="fa-solid fa-trash"></i>
                      </button> */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div class="alert alert-info">
              You could have save ={" "}
              <span id="badHr">
                {bad.reduce((acc, item) => acc + +item.hr, 0)}
              </span>
              hr
            </div>
          </div>
        </div>

        {idsToDelete.length > 0 && (
          <div className="d-grid mb-2">
            <button onClick={() => handleOnDelte()} class="btn btn-danger">
              <i class="fa-solid fa-trash"></i> Delete {idsToDelete.length}{" "}
              {textVal ? `bad` : `good`} tasks
            </button>
          </div>
        )}

        {/* <!-- toat time allocated --> */}
        <div class="alert alert-info">
          Total hrs per week allocated = <span id="totalHr">{totalHrs}</span>
          hr
        </div>
      </div>
    </div>
  );
}

export default App;
