import { useEffect, useState } from "react";
import styles from "../../../assets/styles/UserAdmin/UserAdmin.module.scss";

import {
  getAllUsers,
  deleteUser,
  updateUser,
} from "../../../api/UserAdmin";

import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import Pagination from "../../../components/Pagination/Pagination";

interface User {
  id: number;
  username: string;
  fullName: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export default function UserAdmin() {
  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [keyword, setKeyword] = useState("");

  const [role, setRole] = useState("ALL");

  const [status, setStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [pageSize] = useState(2);

  const [totalItems, setTotalItems] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // =========================
  // LOAD USERS
  // =========================

  const loadUsers = async (page = currentPage) => {
    try {
      setLoading(true);

      const response = await getAllUsers(page, pageSize);

      console.log("USER API:", response);

      setUsers(response?.data || []);

      setCurrentPage(response?.page || page);

      setTotalItems(response?.totalItems || 0);

      setTotalPages(response?.totalPages || 0);
    } catch (error) {
      console.error("Lỗi lấy danh sách user:", error);

      toast.error("Không thể tải danh sách user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1);
  }, []);

  // =========================
  // FILTER
  // =========================

  const filteredUsers = users.filter((user) => {
    const keywordMatch =
      user.username
        ?.toLowerCase()
        .includes(keyword.toLowerCase().trim()) ||
      user.fullName
        ?.toLowerCase()
        .includes(keyword.toLowerCase().trim());

    const roleMatch =
      role === "ALL" ||
      user.role === role;

    const statusMatch =
      status === "ALL" ||
      (status === "ACTIVE" && user.isActive) ||
      (status === "INACTIVE" && !user.isActive);

    return keywordMatch && roleMatch && statusMatch;
  });

  // =========================
  // DELETE
  // =========================

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Xóa người dùng?",
      text: "Tài khoản này sẽ bị xóa khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteUser(id);

      if (response?.success) {
        toast.success(
          response.message || "Xóa user thành công"
        );

        await loadUsers();
      } else {
        toast.error(
          response?.message || "Xóa user thất bại"
        );
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Có lỗi khi xóa user"
      );
    }
  };

  // =========================
  // LOCK / UNLOCK
  // =========================

  const handleToggleStatus = async (user: User) => {
    const isLocking = user.isActive;

    const result = await Swal.fire({
      title: isLocking
        ? "Khóa tài khoản?"
        : "Mở khóa tài khoản?",

      text: isLocking
        ? "Người dùng sẽ không thể sử dụng tài khoản."
        : "Người dùng sẽ có thể sử dụng lại tài khoản.",

      icon: "warning",

      showCancelButton: true,

      confirmButtonText: isLocking
        ? "Khóa tài khoản"
        : "Mở khóa",

      cancelButtonText: "Hủy",

      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await updateUser(user.id, {
        username: user.username,
        passwordHash: "",
        fullName: user.fullName,
        role: user.role as "Admin" | "Customer",
        isActive: !user.isActive,
      });

      if (response?.success !== false) {
        toast.success(
          isLocking
            ? "Đã khóa tài khoản"
            : "Đã mở khóa tài khoản"
        );

        await loadUsers();
      } else {
        toast.error(
          response?.message ||
            "Không thể cập nhật trạng thái"
        );
      }
    } catch (error: any) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Có lỗi khi cập nhật trạng thái"
      );
    }
  };

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date: string) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString(
      "vi-VN"
    );
  };

  return (
    <div className={styles.page}>

      {/* TOAST */}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />

      {/* HEADER */}

      <div className={styles.pageHeader}>
        <div>
          <h1>Quản lý người dùng</h1>

          <p>
            Quản lý tài khoản, quyền truy cập và
            trạng thái người dùng
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() =>
            navigate("/admin/user/add")
          }
        >
          <i className="bi bi-plus-lg"></i>

          <span>Thêm người dùng</span>
        </button>
      </div>

      {/* FILTER */}

      <section className={styles.filterCard}>

        {/* SEARCH */}

        <div className={styles.searchBox}>
          <i className="bi bi-search"></i>

          <input
            type="text"
            value={keyword}
            onChange={(e) =>
              setKeyword(e.target.value)
            }
            placeholder="Tìm kiếm username hoặc họ tên..."
          />
        </div>

        {/* ROLE */}

        <div className={styles.filterItem}>
          <label>Vai trò</label>

          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value)
            }
          >
            <option value="ALL">
              Tất cả vai trò
            </option>

            <option value="Admin">
              Admin
            </option>

            <option value="Customer">
              Customer
            </option>
          </select>
        </div>

        {/* STATUS */}

        <div className={styles.filterItem}>
          <label>Trạng thái</label>

          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value)
            }
          >
            <option value="ALL">
              Tất cả trạng thái
            </option>

            <option value="ACTIVE">
              Đang hoạt động
            </option>

            <option value="INACTIVE">
              Đã khóa
            </option>
          </select>
        </div>

        {/* RESET */}

        <button
          className={styles.resetBtn}
          onClick={() => {
            setKeyword("");
            setRole("ALL");
            setStatus("ALL");
          }}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>

      </section>

      {/* TABLE */}

      <section className={styles.tableCard}>

        <div className={styles.tableHeader}>
          <div>
            <h3>Danh sách người dùng</h3>
          </div>
        </div>

        <div className={styles.tableWrapper}>

          <table>

            <thead>
              <tr>
                <th>STT</th>

                <th>Username</th>

                <th>Họ tên</th>

                <th>Vai trò</th>

                <th>Trạng thái</th>

                <th>Ngày tạo</th>

                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td colSpan={7}>

                    <div className={styles.empty}>
                      Đang tải danh sách người dùng...
                    </div>

                  </td>
                </tr>

              ) : filteredUsers.length === 0 ? (

                <tr>
                  <td colSpan={7}>

                    <div className={styles.empty}>
                      Không tìm thấy người dùng
                    </div>

                  </td>
                </tr>

              ) : (

                filteredUsers.map(
                  (user, index) => (

                    <tr key={user.id}>

                      {/* STT */}

                      <td>
                        <strong
                          className={
                            styles.userId
                          }
                        >
                          {(currentPage - 1) *
                            pageSize +
                            index +
                            1}
                        </strong>
                      </td>

                      {/* USERNAME */}

                      <td>
                        <div
                          className={
                            styles.username
                          }
                        >

                          <div
                            className={
                              styles.avatar
                            }
                          >
                            {user.username
                              ?.charAt(0)
                              ?.toUpperCase()}
                          </div>

                          <strong>
                            {user.username}
                          </strong>

                        </div>
                      </td>

                      {/* FULL NAME */}

                      <td>
                        {user.fullName ||
                          "Chưa cập nhật"}
                      </td>

                      {/* ROLE */}

                      <td>

                        {user.role ===
                        "Admin" ? (

                          <span
                            className={`${styles.role} ${styles.admin}`}
                          >
                            <i className="bi bi-shield-check"></i>
                            Admin
                          </span>

                        ) : (

                          <span
                            className={`${styles.role} ${styles.customer}`}
                          >
                            <i className="bi bi-person"></i>
                            Customer
                          </span>

                        )}

                      </td>

                      {/* STATUS */}

                      <td>

                        {user.isActive ? (

                          <span
                            className={`${styles.status} ${styles.active}`}
                          >
                            <i></i>
                            Đang hoạt động
                          </span>

                        ) : (

                          <span
                            className={`${styles.status} ${styles.inactive}`}
                          >
                            <i></i>
                            Đã khóa
                          </span>

                        )}

                      </td>

                      {/* CREATED */}

                      <td>
                        {formatDate(
                          user.createdAt
                        )}
                      </td>

                      {/* ACTION */}

                      <td>

                        <div
                          className={
                            styles.actions
                          }
                        >

                          {/* VIEW */}

                          <button
                            className={
                              styles.viewBtn
                            }
                            title="Xem chi tiết"
                            onClick={() =>
                              navigate(
                                `/admin/user/detail/${user.id}`
                              )
                            }
                          >
                            <i className="bi bi-eye"></i>
                          </button>

                          {/* EDIT */}

                          <button
                            className={
                              styles.editBtn
                            }
                            title="Chỉnh sửa"
                            onClick={() =>
                              navigate(
                                `/admin/user/update/${user.id}`
                              )
                            }
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>

                          {/* LOCK */}

                          <button
                            className={
                              user.isActive
                                ? styles.lockBtn
                                : styles.unlockBtn
                            }
                            title={
                              user.isActive
                                ? "Khóa tài khoản"
                                : "Mở khóa tài khoản"
                            }
                            onClick={() =>
                              handleToggleStatus(
                                user
                              )
                            }
                          >
                            <i
                              className={
                                user.isActive
                                  ? "bi bi-lock"
                                  : "bi bi-unlock"
                              }
                            ></i>
                          </button>

                          {/* DELETE */}

                          <button
                            className={
                              styles.deleteBtn
                            }
                            title="Xóa"
                            onClick={() =>
                              handleDelete(
                                user.id
                              )
                            }
                          >
                            <i className="bi bi-trash3"></i>
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={loadUsers}
        />

      </section>

    </div>
  );
}