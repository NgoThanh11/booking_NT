import { useEffect, useState } from "react";
import styles from "../../../assets/styles/ServiceAdmin/ServiceAdmin.module.scss";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { deleteBarber, searchBarber } from "../../../api/BarberApi";
import { getAllBranches } from "../../../api/BranchApi";
import Pagination from "../../../components/Pagination/Pagination";
import Swal from "sweetalert2";
import Select from "react-select";
interface Barber {
  barberId: number;
  name: string;
  experience: string;
  phone: string;
  branchId: number;
  branchName?: string | null;
  branch?: {
    branchId: number;
    branchName: string;
  } | null;
}

interface Branch {
  branchId: number;
  branchName: string;
}

interface PaginationInfo {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export default function BarberAdmin() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Giá trị đang nhập trên form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [branchId, setBranchId] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 0,
  });

  const navigate = useNavigate();

  // Lấy danh sách chi nhánh để hiển thị trong select
  const loadBranches = async () => {
    try {
      const response = await getAllBranches();

      const data = Array.isArray(response)
        ? response
        : Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.data)
            ? response.data.data
            : [];

      setBranches(data);
    } catch (error) {
      console.error("Lỗi lấy danh sách chi nhánh:", error);
      toast.error("Không thể tải danh sách chi nhánh");
    }
  };

  // Tìm kiếm Barber bằng API
  const loadBarbers = async (
    searchName: string,
    searchPhone: string,
    searchBranchId: string,
    page: number,
  ) => {
    try {
      setLoading(true);

      const response = await searchBarber({
        name: searchName.trim() || undefined,
        phone: searchPhone.trim() || undefined,
        branchId: searchBranchId ? Number(searchBranchId) : undefined,
        page,
        pageSize,
      });

      if (response?.success) {
        setBarbers(Array.isArray(response.data) ? response.data : []);

        const pageInfo = response.pagination;

        setPagination({
          currentPage: pageInfo?.currentPage ?? page,
          pageSize: pageInfo?.pageSize ?? pageSize,
          totalItems: pageInfo?.totalItems ?? 0,
          totalPages: pageInfo?.totalPages ?? 0,
        });

        setCurrentPage(page);
      } else {
        setBarbers([]);
        setPagination({
          currentPage: 1,
          pageSize,
          totalItems: 0,
          totalPages: 0,
        });

        toast.error(response?.message || "Không tìm thấy Barber");
      }
    } catch (error: any) {
      console.error("Lỗi tìm kiếm Barber:", error);
      toast.error(
        error?.response?.data?.message || "Không thể tải danh sách Barber",
      );
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBranches();
    loadBarbers("", "", "", 1);
  }, []);

  // Nhấn nút tìm kiếm
  const handleSearch = () => {
    loadBarbers(name, phone, branchId, 1);
  };

  // Đặt lại bộ lọc
  const handleReset = () => {
    setName("");
    setPhone("");
    setBranchId("");
    loadBarbers("", "", "", 1);
  };

  // Chuyển trang
  const handlePageChange = (page: number) => {
    loadBarbers(name, phone, branchId, page);
  };

  // Xóa Barber
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Xóa Barber?",
      text: "Barber này sẽ bị xóa khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteBarber(id);

      if (response?.success) {
        toast.success(response.message || "Xóa Barber thành công");

        // Tải lại danh sách với bộ lọc hiện tại
        const pageToLoad =
          barbers.length === 1 && currentPage > 1
            ? currentPage - 1
            : currentPage;

        loadBarbers(name, phone, branchId, pageToLoad);
      } else {
        toast.error(response?.message || "Xóa Barber thất bại");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi khi xóa Barber");
    }
  };

  const formatPhone = (value: string) => {
    return value || "Chưa có số điện thoại";
  };

  return (
    <div className={styles.page}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { fontSize: "14px" },
        }}
      />

      {/* HEADER */}
      <div className={styles.pageHeader}>
        <div>
          <h1>Quản lý Barber</h1>
          <p>Quản lý danh sách thợ cắt tóc Barber Smile11</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/barber/create")}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Thêm Barber</span>
        </button>
      </div>

      {/* BỘ LỌC TÌM KIẾM */}
      <section className={styles.filterCard}>
        <div className={styles.searchBox}>
          <i className="bi bi-person"></i>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên Barber"
          />
        </div>

        <div className={styles.searchBox}>
          <i className="bi bi-telephone"></i>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Nhập số điện thoại"
          />
        </div>
        <div className={styles.searchBox}>
          <i className="bi bi-building"></i>

          <Select
            className={styles.branchSelect}
            classNamePrefix="branch"
            options={branches.map((branch) => ({
              value: String(branch.branchId),
              label: branch.branchName,
            }))}
            value={
              branches
                .filter((branch) => String(branch.branchId) === branchId)
                .map((branch) => ({
                  value: String(branch.branchId),
                  label: branch.branchName,
                }))[0] || null
            }
            onChange={(selected) => setBranchId(selected?.value ?? "")}
            placeholder="Tìm kiếm chi nhánh..."
            isClearable
            isSearchable
            noOptionsMessage={() => "Không tìm thấy chi nhánh"}
            styles={{
              container: (base) => ({
                ...base,
                flex: 1,
                minWidth: 0,
              }),
              control: (base, state) => ({
                ...base,
                minHeight: 38,
                height: 38,
                border: "none",
                boxShadow: "none",
                backgroundColor: "transparent",
                cursor: "pointer",
              }),
              valueContainer: (base) => ({
                ...base,
                padding: "0 4px",
              }),
              indicatorsContainer: (base) => ({
                ...base,
                height: 38,
              }),
              menu: (base) => ({
                ...base,
                zIndex: 100,
              }),
            }}
          />
        </div>

        <button
          className={styles.addBtnSearch}
          type="button"
          onClick={handleSearch}
          disabled={loading}
        >
          <i className="bi bi-search"></i>
          Tìm kiếm
        </button>

        <button
          className={styles.resetBtn}
          type="button"
          title="Đặt lại"
          onClick={handleReset}
          disabled={loading}
        >
          <i className="bi bi-arrow-counterclockwise"></i>
        </button>
      </section>

      {/* TABLE */}
      <section className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <div>
            <h3>Danh sách Barber</h3>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Họ và tên</th>
                <th>Kinh nghiệm</th>
                <th>Số điện thoại</th>
                <th>Chi nhánh</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>
                      Đang tải danh sách Barber...
                    </div>
                  </td>
                </tr>
              ) : barbers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>Không tìm thấy Barber</div>
                  </td>
                </tr>
              ) : (
                barbers.map((barber, index) => (
                  <tr key={barber.barberId}>
                    <td>
                      <strong className={styles.branchesId}>
                        {(currentPage - 1) * pageSize + index + 1}
                      </strong>
                    </td>

                    <td>
                      <div className={styles.branchesName}>
                        <strong>{barber.name}</strong>
                      </div>
                    </td>

                    <td>
                      <div className={styles.description}>
                        {barber.experience || "Chưa cập nhật"}
                      </div>
                    </td>

                    <td>
                      <strong>{formatPhone(barber.phone)}</strong>
                    </td>

                    <td>
                      <strong>
                        {barber.branch?.branchName ??
                          barber.branchName ??
                          "Chưa phân chi nhánh"}
                      </strong>
                    </td>

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/barber/detail/${barber.barberId}`)
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className={styles.editBtn}
                          title="Chỉnh sửa"
                          onClick={() =>
                            navigate(`/admin/barber/update/${barber.barberId}`)
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className={styles.deleteBtn}
                          title="Xóa"
                          onClick={() => handleDelete(barber.barberId)}
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

        {!loading && pagination.totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </section>
    </div>
  );
}
