import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import './ProductProviderForm.css';
import {
  BsChevronDown,
  BsChevronUp,
  BsTrash,
  BsCheckCircleFill,
  BsArrowUp,
  BsArrowDown,
} from 'react-icons/bs';
import type {
  IProduct,
  IProductProviderResponse,
} from '../../../types/product';
import type { IProvider, IProviderProduct } from '../../../types/provider';
import { axiosInstance } from '../../../hooks/useAxios';
import type { HttpResponsePagination } from '../../../types/global';
import Swal from 'sweetalert2';
import truncateText from '../../../utils/truncateText';

interface ProductProviderFormProps {
  productForm: ReturnType<typeof useFormik<IProduct>>;
}

export default function ProductProviderForm({
  productForm,
}: ProductProviderFormProps) {
  const [expandedIndexes, setExpandedIndexes] = useState<number[]>([]);
  const [providers, setProviders] = useState<IProvider[]>([]);

  useEffect(() => {
    const fetchProvidersData = async () => {
      try {
        const response = await axiosInstance.get<
          HttpResponsePagination<IProvider>
        >(`/providers?page=1&perPage=9999`);
        setProviders(response.data?.data);
      } catch (error) {
        console.error('Failed to fetch providers:', error);
      }
    };

    fetchProvidersData();
  }, []);

  const toggleExpand = (index: number) => {
    setExpandedIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index],
    );
  };

  const removeProvider = (index: number) => {
    const updated = [...productForm.values.providers];
    updated.splice(index, 1);
    productForm.setFieldValue('providers', updated);
    setExpandedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleCheckProductProvider = async (
    provider: IProductProviderResponse,
    index: number,
  ) => {
    const providerId = provider.providerId;
    const productId = provider.id;

    if (!providerId || !productId) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาเลือกร้านและใส่รหัสสินค้าก่อนทำการยืนยัน',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    try {
      const response = await axiosInstance.post<IProviderProduct>(
        `/providers/check/${providerId}`,
        {
          productId,
        },
      );

      const data = response.data;

      productForm.setFieldValue(`providers[${index}].name`, data.name || '');
      productForm.setFieldValue(`providers[${index}].price`, data.price || 0);
      productForm.setFieldValue(
        `providers[${index}].quantity`,
        data.quantity || 0,
      );
      productForm.setFieldValue(
        `providers[${index}].purchasable`,
        data.purchasable || 0,
      );
    } catch (error) {
      console.error('Error checking product provider:', error);
      await Swal.fire({
        icon: 'error',
        title: 'เกิดข้อผิดพลาด',
        text: 'ไม่สามารถยืนยันข้อมูลสินค้าได้',
        confirmButtonText: 'ตกลง',
      });
    }
  };

  const moveProviderUp = (index: number) => {
    if (index === 0) return;
    const updated = [...productForm.values.providers];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    productForm.setFieldValue('providers', updated);
  };

  const moveProviderDown = (index: number) => {
    if (index === productForm.values.providers.length - 1) return;
    const updated = [...productForm.values.providers];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    productForm.setFieldValue('providers', updated);
  };

  const handleProviderSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const selectedProviderId = event.target.value;
    productForm.setFieldValue(
      `providers[${index}].providerId`,
      selectedProviderId,
    );

    productForm.setFieldValue(`providers[${index}].name`, '');
    productForm.setFieldValue(`providers[${index}].price`, 0);
    productForm.setFieldValue(`providers[${index}].quantity`, 0);
    productForm.setFieldValue(`providers[${index}].purchasable`, 0);
  };

  return (
    <>
      <div
        className="d-flex flex-column px-3 gap-3 py-3 rounded-bottom-4 border-0 fw-bold card"
        style={{
          boxShadow: '0 4px 12px rgba(255, 215, 243, 0.43)',
        }}
      >
        <div className="form-group">
          <label className="mb-2">ตัวแทนจำหน่าย</label>
          <div className="provider-list-container">
            {productForm.values.providers?.map((provider, index) => {
              const isExpanded = expandedIndexes.includes(index);

              const isVerified = provider.name != '' && provider.price != 0;
              return (
                <div key={index} className="provider-item">
                  <div
                    className="provider-header"
                    onClick={() => toggleExpand(index)}
                  >
                    <div className="d-flex flex-row justify-content-center align-items-center gap-3">
                      <div className="d-flex flex-column">
                        <button
                          type="button"
                          className="btn btn-light btn-sm p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveProviderUp(index);
                          }}
                          disabled={index === 0}
                        >
                          <BsArrowUp />
                        </button>
                        <button
                          type="button"
                          className="btn btn-light btn-sm p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveProviderDown(index);
                          }}
                          disabled={
                            index === productForm.values.providers.length - 1
                          }
                        >
                          <BsArrowDown />
                        </button>
                      </div>
                      {isVerified && (
                        <img
                          src={providers?.[index]?.imageUrl}
                          alt={providers?.[index]?.name}
                          className="rounded-4"
                          style={{
                            height: '50px',
                            width: '50px',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <span className="provider-title">
                        {`[${truncateText(providers?.[index]?.name, 7)}] ${truncateText(provider.name || '', 7)} ` ||
                          `ตัวแทน #${index + 1}`}
                      </span>
                    </div>
                    <div className="provider-actions">
                      <button
                        type="button"
                        className="btn-check-provider"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckProductProvider(provider, index);
                        }}
                      >
                        <BsCheckCircleFill
                          size={16}
                          color={isVerified ? 'green' : 'grey'}
                        />
                      </button>
                      <button
                        type="button"
                        className="btn-delete-provider"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeProvider(index);
                        }}
                      >
                        <BsTrash size={16} />
                      </button>
                      <span>
                        {isExpanded ? <BsChevronUp /> : <BsChevronDown />}
                      </span>
                    </div>
                  </div>
                  <div
                    className={`provider-body ${isExpanded ? 'expanded' : ''}`}
                  >
                    <div className="d-flex flex-column gap-3">
                      {isVerified && (
                        <div className="verified-info-container ps-2">
                          <div className="row">
                            <div className="col-md-4">
                              <strong>ราคา:</strong> {provider.price}
                            </div>
                            <div className="col-md-4">
                              <strong>จำนวน:</strong> {provider.quantity}
                            </div>
                            <div className="col-md-4">
                              <strong>สั่งซื้อได้:</strong>{' '}
                              {provider.purchasable}
                            </div>
                          </div>
                        </div>
                      )}
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name={`providers[${index}].isOpen`}
                          className="form-check-input"
                          checked={provider.isOpen}
                          onChange={productForm.handleChange}
                        />
                        <label className="form-check-label">เปิดใช้งาน</label>
                      </div>
                      <div className="form-group">
                        <label>เลือกร้าน</label>
                        <select
                          name={`providers[${index}].providerId`}
                          className="form-select"
                          value={provider.providerId}
                          onChange={(e) => handleProviderSelectChange(e, index)}
                        >
                          <option value="" disabled>
                            เลือกร้าน
                          </option>
                          {providers?.map((p) => (
                            <option key={p._id} value={p._id}>
                              {p.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>รหัสสินค้า</label>
                        <input
                          type="text"
                          name={`providers[${index}].id`}
                          className="form-control"
                          value={provider.id || ''}
                          onChange={(event) => {
                            productForm.handleChange(event);

                            productForm.setFieldValue(
                              `providers[${index}].name`,
                              '',
                            );
                            productForm.setFieldValue(
                              `providers[${index}].price`,
                              0,
                            );
                            productForm.setFieldValue(
                              `providers[${index}].quantity`,
                              0,
                            );
                            productForm.setFieldValue(
                              `providers[${index}].purchasable`,
                              0,
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            className="btn btn-primary btn-add-provider"
            onClick={() =>
              productForm.setFieldValue('providers', [
                ...(productForm.values.providers || []),
                {
                  id: '',
                  providerId: '',
                  isOpen: true,
                  name: '',
                  price: 0,
                  quantity: 0,
                  purchasable: 0,
                },
              ])
            }
          >
            เพิ่มตัวแทนจำหน่าย
          </button>
        </div>
      </div>
    </>
  );
}
