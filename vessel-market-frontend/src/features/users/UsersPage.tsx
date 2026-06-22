import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../../api/users";
import { ErrorState, LoadingState } from "../../components/Status";

export function UsersPage() {
  const users = useQuery({ queryKey: ["users"], queryFn: getUsers });

  return (
    <section className="page-stack">
      <header className="page-header">
        <div>
          <p>Admin management</p>
          <h1>Users</h1>
        </div>
      </header>

      <div className="panel">
        <div className="panel-heading">
          <h2>Office accounts</h2>
          <p>Admin-only list from the FastAPI users endpoint.</p>
        </div>
        {users.isLoading ? <LoadingState /> : null}
        {users.isError ? <ErrorState message="Unable to load users." /> : null}
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.data?.map((user) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-pill ${user.role === "admin" ? "admin" : ""}`}>{user.role}</span>
                  </td>
                  <td>{user.is_active ? "Active" : "Inactive"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
