import React, { useState, useEffect } from "react";

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const fetchUsers = async (page) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/user?page=${page}`
      );
      const data = await response.json();
      setUsers(data.users);
      setCurrentPage(data.currentPage);
      setTotalPages(data.totalPages);
      setTotalCount(data.totalCount);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/user/${userId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUsers();
      } else {
        console.error("Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mt-5">
      <h2 className="d-flex justify-content-between mb-4">
        User Table
        <div>
          Total Records: <strong className="text-primary">{totalCount}</strong>
        </div>
      </h2>
      <table className="table table-bordered text-center align-middle">
        <thead className="bg-dark text-white">
          <tr>
            <th>Picture</th>
            <th>Name</th>
            <th>Email</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={`http://localhost:5000/${user.profilePic}`}
                    alt={user.name}
                    style={{ width: "50px", height: "50px" }}
                    className="img-fluid rounded-circle"
                  />
                </td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button className="btn btn-primary mx-1">Edit</button>
                  <button
                    className="btn btn-danger mx-1"
                    onClick={() => deleteUser(user._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center text-danger fw-bolder">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="d-flex justify-content-center my-4">
        <nav aria-label="Page navigation">
          <ul className="pagination">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
                aria-label="Previous"
              >
                <span aria-hidden="true">&laquo;</span>
              </button>
            </li>
            <li className="page-item">
              <span className="page-link">{`Page ${currentPage} of ${totalPages}`}</span>
            </li>
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
                aria-label="Next"
              >
                <span aria-hidden="true">&raquo;</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default UserTable;
