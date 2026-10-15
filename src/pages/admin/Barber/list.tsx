import { useEffect, useState } from "react";
import styles from "../../../assets/styles/ServiceAdmin/ServiceAdmin.module.scss";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { getAllBarbers } from "../../../api/BarberApi";
import Pagination from "../../../components/Pagination/Pagination";

interface Barber {
  barberId: number;
  name: string;
  experience: string;
  phone: string;
  branchId: number;
  branch: {
    branchId: number;
    branchName: string;
  } | null;
}

export default function BarberAdmin() {
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const navigate = useNavigate();

  // Lấy danh sách Barber từ API
  const loadBarbers = async () => {
    try {
      setLoading(true);

      const response = await getAllBarbers();

      console.log("API Barbers:", response);

      // API có thể trả về mảng trực tiếp hoặc object chứa data
      const data = Array.isArray(response) ? response : response?.data;

      if (Array.isArray(data)) {
        setBarbers(data);
      } else {
        setBarbers([]);
        toast.error("Dữ liệu Barber không hợp lệ");
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách Barber:", error);
      toast.error("Không thể tải danh sách Barber");
      setBarbers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBarbers();
  }, []);

  // Định dạng số điện thoại
  const formatPhone = (phone: string) => {
    if (!phone) return "Chưa có số điện thoại";
    return phone;
  };

  // Tìm kiếm Barber theo tên, số điện thoại,
  // kinh nghiệm hoặc mã chi nhánh
  const filteredBarbers = barbers.filter((barber) => {
    const searchKeyword = keyword.toLowerCase().trim();

    if (!searchKeyword) return true;

    return (
      barber.name?.toLowerCase().includes(searchKeyword) ||
      barber.phone?.toLowerCase().includes(searchKeyword) ||
      barber.experience?.toLowerCase().includes(searchKeyword) ||
      String(barber.branchId).includes(searchKeyword)
    );
  });

  // Phân trang phía Frontend
  const totalItems = filteredBarbers.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  const paginatedBarbers = filteredBarbers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  // Khi tìm kiếm thì quay về trang đầu tiên
  const handleSearch = (value: string) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.page}>
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
          <h1>Quản lý Barber</h1>
          <p>Quản lý danh sách thợ cắt tóc Barber Smile11</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/barbers/add")}
        >
          <i className="bi bi-plus-lg"></i>
          <span>Thêm Barber</span>
        </button>
      </div>

      {/* SEARCH */}
      <section className={styles.filterCard}>
        <div className={styles.searchBox}>
          <i className="bi bi-search"></i>

          <input
            type="text"
            value={keyword}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Tìm kiếm Barber..."
          />
        </div>

        <button
          className={styles.resetBtn}
          title="Đặt lại"
          onClick={() => {
            setKeyword("");
            setCurrentPage(1);
          }}
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
                <th>Mã chi nhánh</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {/* LOADING */}
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>
                      Đang tải danh sách Barber...
                    </div>
                  </td>
                </tr>
              ) : /* EMPTY */
              paginatedBarbers.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <div className={styles.empty}>Không tìm thấy Barber</div>
                  </td>
                </tr>
              ) : (
                /* DATA */
                paginatedBarbers.map((barber, index) => (
                  <tr key={barber.barberId}>
                    {/* STT */}
                    <td>
                      <strong className={styles.branchesId}>
                        {(currentPage - 1) * pageSize + index + 1}
                      </strong>
                    </td>

                    {/* TÊN BARBER */}
                    <td>
                      <div className={styles.branchesName}>
                        <strong>{barber.name}</strong>
                      </div>
                    </td>

                    {/* KINH NGHIỆM */}
                    <td>
                      <div className={styles.description}>
                        {barber.experience || "Chưa cập nhật"}
                      </div>
                    </td>

                    {/* SỐ ĐIỆN THOẠI */}
                    <td>
                      <strong>{formatPhone(barber.phone)}</strong>
                    </td>

                    {/* CHI NHÁNH */}
                    <td>
                      <strong>
                        {barber.branch?.branchName ?? "Chưa phân chi nhánh"}
                      </strong>
                    </td>

                    {/* ACTION */}
                    <td>
                      <div className={styles.actions}>
                        {/* XEM */}
                        <button
                          className={styles.viewBtn}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/barber/detail/${barber.barberId}`)
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        {/* SỬA */}
                        <button
                          className={styles.editBtn}
                          title="Chỉnh sửa"
                          onClick={() =>
                            navigate(`/admin/barber/update/${barber.barberId}`)
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        {/* XÓA */}
                        <button
                          className={styles.deleteBtn}
                          title="Xóa"
                          onClick={() =>
                            toast("Bạn cần tích hợp API xóa Barber")
                          }
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

        {!loading && totalItems > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
          />
        )}
      </section>
    </div>
  );
}
