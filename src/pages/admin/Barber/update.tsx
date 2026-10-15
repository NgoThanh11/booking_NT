import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Select from "react-select";
import toast, { Toaster } from "react-hot-toast";

import styles from "../../../assets/styles/BranchAdmin/BranchAdd.module.scss";
import { getByIdBarber, updateBarber } from "../../../api/BarberApi";
import { getAllBranches } from "../../../api/BranchApi";

interface Branch {
  branchId: number;
  branchName: string;
  branchAddress: string;
  branchPhone: string;
  createdAt?: string;
}

interface BarberForm {
  name: string;
  experience: string;
  phone: string;
  branchId: string;
  age: string;
  placeResidence: string;
  idCard: string;
}

export default function BarberUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<BarberForm>({
    name: "",
    experience: "",
    phone: "",
    branchId: "",
    placeResidence: "",
    idCard: "",
    age: "",
  });

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [loading, setLoading] = useState(false);

  // Tải thông tin barber và danh sách chi nhánh
  useEffect(() => {
    const loadData = async () => {
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        toast.error("ID barber không hợp lệ");
        setLoadingData(false);
        return;
      }

      try {
        setLoadingData(true);

        const [barberResponse, branchResponse] = await Promise.all([
          getByIdBarber(Number(id)),
          getAllBranches(1, 100),
        ]);

        // API chi tiết có thể trả trực tiếp barber
        // hoặc trả về { success, data: barber }
        const barber = barberResponse?.data ?? barberResponse;

        if (
          barberResponse?.success === false ||
          !barber ||
          barber.barberId == null
        ) {
          toast.error(barberResponse?.message || "Không tìm thấy barber");
          return;
        }

        const branchData = Array.isArray(branchResponse)
          ? branchResponse
          : branchResponse?.data;

        setBranches(Array.isArray(branchData) ? branchData : []);

        setFormData({
          name: barber.name ?? "",
          experience: barber.experience ?? "",
          phone: barber.phone ?? "",
          idCard: barber.idCard ?? "",
          placeResidence: barber.placeResidence ?? "",
          age: barber.age ? String(barber.age).split("T")[0] : "",
          branchId: barber.branchId != null ? String(barber.branchId) : "",
        });
      } catch (error: any) {
        console.error("Lỗi tải dữ liệu barber:", error);

        toast.error(
          error?.response?.data?.message || "Không thể tải thông tin barber",
        );
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const selectedBranch =
    branchOptions.find(
      (option) => option.value === Number(formData.branchId),
    ) ?? null;

  const branchSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: "46px",
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
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
      toast.error("ID barber không hợp lệ");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Vui lòng nhập tên barber");
      return;
    }

    if (!formData.phone.trim()) {
      toast.error("Vui lòng nhập số điện thoại");
      return;
    }

    if (!formData.experience.trim()) {
      toast.error("Vui lòng nhập kinh nghiệm");
      return;
    }

    if (!formData.branchId) {
      toast.error("Vui lòng chọn chi nhánh");
      return;
    }
    if (!formData.age) {
      toast.error("Vui lòng nhập ngày sinh");
      return;
    }
    if (!formData.placeResidence) {
      toast.error("Vui lòng nhập quê quán");
      return;
    }
    if (!formData.idCard) {
      toast.error("Vui lòng nhập số căn cước công dân");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: formData.name.trim(),
        experience: formData.experience.trim(),
        phone: formData.phone.trim(),
        branchId: Number(formData.branchId),
        age: formData?.age,
        placeResidence: formData?.placeResidence,
        idCard: formData?.idCard,
      };

      const response = await updateBarber(Number(id), payload);

      if (response?.success === false) {
        toast.error(response.message || "Cập nhật barber thất bại");
        return;
      }

      toast.success(response?.message || "Cập nhật barber thành công");

      setTimeout(() => {
        navigate("/admin/barber");
      }, 800);
    } catch (error: any) {
      console.error("Lỗi cập nhật barber:", error);

      toast.error(
        error?.response?.data?.message || "Có lỗi xảy ra khi cập nhật barber",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className={styles.page}>
        <Toaster position="top-right" />
        <p>Đang tải thông tin barber...</p>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Toaster
        position="top-right"
        toastOptions={{ style: { fontSize: "14px" } }}
      />

      <div className={styles.pageHeader}>
        <div>
          <h1>Cập nhật barber</h1>
          <p>Chỉnh sửa thông tin thợ cắt tóc</p>
        </div>
      </div>

      <section className={styles.formCard}>
        <div className={styles.formHeader}>
          <div className={styles.formIcon}>
            <i className="bi bi-person-gear"></i>
          </div>

          <div>
            <h3>Thông tin barber</h3>
            <p>Cập nhật thông tin barber và chi nhánh làm việc</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>
                Tên barber <span>*</span>
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
                  required
                />
              </div>
            </div>

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
                  required
                />
              </div>
            </div>

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
                  placeholder="Ví dụ: 3 năm kinh nghiệm"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>
                Chi nhánh <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-geo-alt"></i>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <Select
                    options={branchOptions}
                    value={selectedBranch}
                    onChange={(option) => {
                      setFormData((prev) => ({
                        ...prev,
                        branchId: option ? String(option.value) : "",
                      }));
                    }}
                    placeholder="Tìm kiếm chi nhánh..."
                    isSearchable
                    isClearable
                    isDisabled={loading}
                    noOptionsMessage={() => "Không tìm thấy chi nhánh"}
                    styles={branchSelectStyles}
                    classNamePrefix="branch-select"
                  />
                </div>
              </div>

              {branches.length === 0 && (
                <small>Không có dữ liệu chi nhánh. Hãy kiểm tra API.</small>
              )}
            </div>
            <div className={styles.formGroup}>
              <label>
                Căn cước công dân <span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-award"></i>
                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  placeholder="Vui lòng nhập căn cước công dân"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label>
                Ngày sinh<span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-award"></i>
                <input
                  type="date"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Ví dụ: 3 năm kinh nghiệm"
                  disabled={loading}
                  required
                />
              </div>
            </div>
            <div className={styles.formGroupFull}>
              <label>
                Quê quán<span>*</span>
              </label>

              <div className={styles.inputWrapper}>
                <i className="bi bi-award"></i>
                <input
                  type="text"
                  name="placeResidence"
                  value={formData.placeResidence}
                  onChange={handleChange}
                  placeholder="Vui lòng nhập quê quán"
                  disabled={loading}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate("/admin/barber")}
              disabled={loading}
            >
              Quay lại
            </button>

            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className={styles.spinner}></span>
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <i className="bi bi-check-lg"></i>
                  Lưu thay đổi
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
