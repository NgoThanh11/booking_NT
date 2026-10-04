import { useEffect, useState } from "react";
import styles from "../../../assets/styles/ServiceAdmin.module.scss";
import { deleteService, GetAllServices } from "../../../api/ServiceApi";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Swal from "sweetalert2";
interface Service {
  id: number;
  name: string;
  url: string;
  description: string;
  price: number;
  durationMinutes: number;
  status: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export default function ServiceAdmin() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("ALL");

  const navigate = useNavigate();

  const loadServices = async () => {
    try {
      setLoading(true);

      const response = await GetAllServices();

      console.log("SERVICE API:", response);

      setServices(response || []);
    } catch (error) {
      console.error("Lỗi lấy danh sách dịch vụ:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")} VNĐ`;
  };

  const getImageUrl = (url: string) => {
    if (!url) {
      return "/images/haircut-1.jpg";
    }

    if (url.startsWith("http")) {
      return url;
    }

    return `http://localhost:5021${url}`;
  };

  const filteredServices = services.filter((service) => {
    const keywordMatch = service.name
      .toLowerCase()
      .includes(keyword.toLowerCase().trim());

    const statusMatch =
      status === "ALL" ||
      (status === "ACTIVE" && service.status) ||
      (status === "INACTIVE" && !service.status);

    return keywordMatch && statusMatch;
  });
  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Xóa dịch vụ?",
      text: "Dịch vụ này sẽ bị xóa khỏi hệ thống.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      const response = await deleteService(id);

      if (response?.success) {
        toast.success(response.message || "Xóa dịch vụ thành công");
        await loadServices();
      } else {
        toast.error(response?.message || "Xóa dịch vụ thất bại");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Có lỗi khi xóa dịch vụ");
    }
  };
  return (
    <div className={styles.page}>
      {/* HEADER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            fontSize: "14px",
          },
        }}
      />
      <div className={styles.pageHeader}>
        <div>
          <h1>Quản lý dịch vụ</h1>

          <p>Quản lý danh sách dịch vụ, giá và trạng thái dịch vụ</p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => navigate("/admin/Service/add")}
        >
          <i className="bi bi-plus-lg"></i>

          <span>Thêm dịch vụ</span>
        </button>
      </div>

      {/* FILTER */}

      <section className={styles.filterCard}>
        <div className={styles.searchBox}>
          <i className="bi bi-search"></i>

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
          />
        </div>

        <div className={styles.filterItem}>
          <label>Trạng thái</label>

          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="ALL">Tất cả trạng thái</option>

            <option value="ACTIVE">Đang hoạt động</option>

            <option value="INACTIVE">Ngừng hoạt động</option>
          </select>
        </div>

        <button
          className={styles.resetBtn}
          onClick={() => {
            setKeyword("");
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
            <h3>Danh sách dịch vụ</h3>

            <span>Hiển thị {filteredServices.length} dịch vụ</span>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>STT</th>

                <th>Hình ảnh</th>

                <th>Dịch vụ</th>

                <th>Mô tả</th>

                <th>Giá</th>

                <th>Thời gian</th>

                <th>Trạng thái</th>

                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.empty}>
                      Đang tải danh sách dịch vụ...
                    </div>
                  </td>
                </tr>
              ) : filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className={styles.empty}>Không tìm thấy dịch vụ</div>
                  </td>
                </tr>
              ) : (
                filteredServices.map((service, index) => (
                  <tr key={service.id}>
                    {/* STT */}

                    <td>
                      <strong className={styles.serviceId}>{index + 1}</strong>
                    </td>

                    {/* IMAGE */}

                    <td>
                      <div className={styles.imageBox}>
                        <img
                          src={getImageUrl(service.url)}
                          alt={service.name}
                          onError={(e) => {
                            e.currentTarget.src = "/images/haircut-1.jpg";
                          }}
                        />
                      </div>
                    </td>

                    {/* NAME */}

                    <td>
                      <div className={styles.serviceName}>
                        <strong>{service.name}</strong>
                      </div>
                    </td>

                    {/* DESCRIPTION */}

                    <td>
                      <div className={styles.description}>
                        {service.description || "Chưa có mô tả"}
                      </div>
                    </td>

                    {/* PRICE */}

                    <td>
                      <strong className={styles.price}>
                        {formatPrice(service.price)}
                      </strong>
                    </td>

                    {/* TIME */}

                    <td>
                      <span className={styles.duration}>
                        <i className="bi bi-clock"></i>
                        {service.durationMinutes}
                        phút
                      </span>
                    </td>

                    {/* STATUS */}

                    <td>
                      {service.status ? (
                        <span className={`${styles.status} ${styles.active}`}>
                          <i></i>
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className={`${styles.status} ${styles.inactive}`}>
                          <i></i>
                          Ngừng hoạt động
                        </span>
                      )}
                    </td>

                    {/* ACTION */}

                    <td>
                      <div className={styles.actions}>
                        <button
                          className={styles.viewBtn}
                          title="Xem chi tiết"
                          onClick={() =>
                            navigate(`/admin/Service/${service.id}`)
                          }
                        >
                          <i className="bi bi-eye"></i>
                        </button>

                        <button
                          className={styles.editBtn}
                          title="Chỉnh sửa"
                          onClick={() =>
                            navigate(`/admin/Service/update/${service?.id}`)
                          }
                        >
                          <i className="bi bi-pencil-square"></i>
                        </button>

                        <button
                          className={styles.deleteBtn}
                          title="Xóa"
                          onClick={() => handleDelete(service?.id)}
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

        {/* PAGINATION */}

        <div className={styles.pagination}>
          <span>
            Hiển thị{" "}
            {filteredServices.length > 0
              ? `1 - ${filteredServices.length}`
              : "0"}{" "}
            trong tổng số {filteredServices.length}
          </span>

          <div>
            <button disabled>‹</button>

            <button className={styles.current}>1</button>

            <button disabled>›</button>
          </div>
        </div>
      </section>
    </div>
  );
}
