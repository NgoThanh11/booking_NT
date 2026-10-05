import { useEffect, useState } from "react";
import styles from "../../../assets/styles/ServiceAdmin.module.scss";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
import { deleteBranch, getAllBranches } from "../../../api/BranchApi";
import Pagination from "../../../components/Pagination/Pagination";

interface Branch {
  branchId: number;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  createdAt: string;
}

export default function BranchAdmin() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const navigate = useNavigate();

  // =========================
  // LẤY DANH SÁCH CHI NHÁNH
  // =========================
  const loadBranches = async (page = currentPage) => {
    try {
      setLoading(true);

      const response = await getAllBranches(page, pageSize);

      console.log("API Branches:", response);

      setBranches(response?.data || []);
      setCurrentPage(response.page);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Lỗi lấy danh sách chi nhánh:", error);

      toast.error("Không thể tải danh sách chi nhánh");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches(1);
  }, []);

  const formatPhone = (phone: string) => {
    if (!phone) return "Chưa có số điện thoại";

    return phone;
  };

  const filteredBranches = branches?.filter((branch) => {
    const searchKeyword = keyword?.toLowerCase()?.trim();

    if (!searchKeyword) return true;

    return (
      branch.branchName?.toLowerCase().includes(searchKeyword) ||
      branch.branchAddress?.toLowerCase().includes(searchKeyword) ||
      branch.branchPhone?.toLowerCase().includes(searchKeyword)
    );
  });

  // =========================
  // XÓA CHI NHÁNH
  // =========================
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Xóa chi nhánh?",
      text: "Chi nhánh này sẽ bị xóa khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteBranch(id);

      if (response?.success) {
        toast.success(response.message || "Xóa chi nhánh thành công");

        await loadBranches();
      } else {
        toast.error(response?.message || "Xóa chi nhánh thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi xóa chi nhánh:", error);

      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi xóa chi nhánh",
      );
    }
  };

  return (
    <div className={styles.page}>
      {/* =========================
          TOASTER
      ========================= */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />

      {/* =========================
          HEADER
      ========================= */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Quản lý chi nhánh</h1>

          <p>Quản lý danh sách chi nhánh trên toàn quốc Barber Smile11</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/Branch/add")}
        >
          <i className="bi bi-plus-lg"></i>

          <span>Thêm chi nhánh</span>
        </button>
      </div>

      {/* =========================
          SEARCH
      ========================= */}
      <section className={styles.filterCard}>
        <div className={styles.searchBox}>
          <i className="bi bi-search"></i>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm chi nhánh..."
          />
        </div>

        <button
          className={styles.resetBtn}
          title="Đặt lại"
          onClick={() => {
            setKeyword("");
          }}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </section>

      {/* =========================
          TABLE
      ========================= */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3>Danh sách chi nhánh</h3>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>STT</th>

                <th>Chi nhánh</th>

                <th>Địa chỉ</th>

                <th>Số điện thoại</th>

                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading ? (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.empty}>
                      Đang tải danh sách chi nhánh...
                    </div>
                  </td>
                </tr>
              ) : /* EMPTY */
              filteredBranches.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <div className={styles.empty}>Không tìm thấy chi nhánh</div>
                  </td>
                </tr>
              ) : (
                /* DATA */
                filteredBranches.map((branch, index) => (
                  <tr key={branch.branchId}>
                    {/* STT */}
                    <td>
                      <strong className={styles.branchesId}>
                        {(currentPage - 1) * pageSize + index + 1}
                      </strong>
                    </td>

                    {/* CHI NHÁNH */}
                    <td>
                      <div className={styles.branchesName}>
                        <strong>{branch.branchName}</strong>
                      </div>
                    </td>

                    {/* ĐỊA CHỈ */}
                    <td>
                      <div className={styles.description}>
                        {branch.branchAddress || "Chưa có địa chỉ"}
                      </div>
                    </td>

                    <td>
                      <strong>{formatPhone(branch.branchPhone)}</strong>
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className={styles.actions}>
                        {/* XEM */}
                        <button
                          className={styles.viewBtn}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/branch/detail/${branch.branchId}`)
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* SỬA */}
                        <button
                          className={styles.editBtn}
                          title="Chỉnh sửa"
                          onClick={() =>
                            navigate(`/admin/branch/update/${branch.branchId}`)
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        {/* XÓA */}
                        <button
                          className={styles.deleteBtn}
                          title="Xóa"
                          onClick={() => handleDelete(branch.branchId)}
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={loadBranches}
        />
      </section>
    </div>
  );
}
