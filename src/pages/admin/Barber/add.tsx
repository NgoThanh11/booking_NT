import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import Select from "react-select";
import styles from "../../../assets/styles/BranchAdmin/BranchAdd.module.scss";
import { createBarber } from "../../../api/BarberApi";
import { getAllBranches } from "../../../api/BranchApi";

interface Branch {
  branchId: number;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  createdAt: string;
  
}

export default function BarberAdd() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    experience: "",
    phone: "",
    branchId: "",
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingBranches, setLoadingBranches] = useState(true);

  // LẤY DANH SÁCH CHI NHÁNH
  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoadingBranches(true);

        const response = await getAllBranches(1, 9999);

        const data = Array.isArray(response) ? response : response?.data;

        if (Array.isArray(data)) {
          setBranches(data);
        } else {
          setBranches([]);
          toast.error("Dữ liệu chi nhánh không hợp lệ");
        }
      } catch (error) {
        console.error("Lỗi lấy danh sách chi nhánh:", error);
        toast.error("Không thể tải danh sách chi nhánh");
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, []);

  // HANDLE CHANGE
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const branchOptions = branches.map((branch) => ({
    value: branch.branchId,
    label: `${branch.branchName} - ${branch.branchAddress}`,
  }));

  const branchSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
        height : "44px",
      borderRadius: "8px",
      borderColor: state.isFocused ? "#15397F" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 2px rgba(21, 57, 127, 0.12)" : "none",
      "&:hover": {
        borderColor: "#15397F",
      },
    }),
    menu: (base: any) => ({
      ...base,
      zIndex: 20,
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "#15397F"
        : state.isFocused
          ? "#eef2fa"
          : "#fff",
      color: state.isSelected ? "#fff" : "#333",
      cursor: "pointer",
    }),
  };
  // SUBMIT
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên barber");
      return;
    }

    if (!formData.experience.trim()) {
      toast.error("Vui lòng nhập kinh nghiệm");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!formData.branchId) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        experience: formData.experience.trim(),
        phone: formData.phone.trim(),
        branchId: Number(formData.branchId),
      };

      console.log("Payload tạo Barber:", payload);

      const response = await createBarber(payload);

      if (response?.success) {
        toast.success(response.message || "Thêm thợ cắt tóc thành công");

        setFormData({
          name: "",
          experience: "",
          phone: "",
          branchId: "",
        });

        setTimeout(() => {
          navigate("/admin/barber");
        }, 800);
      } else {
        toast.error(response?.message || "Thêm thợ cắt tóc thất bại");
      }
    } catch (error: any) {
      console.error("Lỗi thêm thợ cắt tóc:", error);

      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi thêm thợ cắt tóc",
      );
    } finally {
      setLoading(false);
    }
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
          <h1>Thêm thợ cắt tóc</h1>
          <p>Tạo mới thông tin thợ cắt tóc Barber Smile11</p>
        </div>
      </div>

      {/* FORM */}
      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-shop"></i>
          </div>

          <div>
            <h3>Thông tin barber</h3>
            <p>Nhập đầy đủ thông tin của barber mới</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            {/* TÊN BARBER */}
            <div className={styles.formGroup}>
              <label>
                Tên Barber <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-person"></i>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập tên barber"
                  disabled={loading}
                />
              </div>
            </div>

            {/* SỐ ĐIỆN THOẠI */}
            <div className={styles.formGroup}>
              <label>
                Số điện thoại <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-telephone"></i>

                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                  disabled={loading}
                />
              </div>
            </div>

            {/* KINH NGHIỆM */}
            <div className={styles.formGroup}>
              <label>
                Kinh nghiệm <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-award"></i>

                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Ví dụ: 3 Năm kinh nghiệm"
                  disabled={loading}
                />
              </div>
            </div>

            {/* CHỌN CHI NHÁNH */}
            <div className={styles.formGroup}>
              <label>
                Chi nhánh <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-geo-alt"></i>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Select
                    options={branchOptions}
                    value={
                      branchOptions.find(
                        (option) => option.value === Number(formData.branchId),
                      ) || null
                    }
                    onChange={(selectedOption) => {
                      setFormData((prev) => ({
                        ...prev,
                        branchId: selectedOption
                          ? String(selectedOption.value)
                          : "",
                      }));
                    }}
                    placeholder={
                      loadingBranches
                        ? "Đang tải chi nhánh..."
                        : "Tìm kiếm hoặc chọn chi nhánh..."
                    }
                    isLoading={loadingBranches}
                    isDisabled={loading || loadingBranches}
                    isClearable
                    isSearchable
                    noOptionsMessage={() => "Không tìm thấy chi nhánh"}
                    loadingMessage={() => "Đang tải dữ liệu..."}
                    styles={branchSelectStyles}
                    classNamePrefix="branch-select"
                  />
                </div>
              </div>

              {!loadingBranches && branches.length === 0 && (
                <small>
                  Không có chi nhánh. Bạn hãy kiểm tra API chi nhánh.
                </small>
              )}
            </div>
          </div>

          {/* ACTION */}
          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/admin/barbers")}
              disabled={loading}
            >
              Quay lại
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || loadingBranches}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  Thêm barber
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
