import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import './ProductItemProviderForm.css';
import {
  BsChevronDown,
  BsChevronUp,
  BsTrash,
  BsCheckCircleFill,
  BsFillCaretDownFill,
  BsFillCaretUpFill,
} from 'react-icons/bs';
import { axiosInstance } from '../../../hooks/useAxios';
import type { HttpResponsePagination } from '../../../types/global';
import Swal from 'sweetalert2';
import truncateText from '../../../utils/truncateText';
import type {
  IProductItem,
  IProductItemProviderResponse,
} from '../../../types/product-item';
import type { IProvider } from '../../../types/provider';

interface ProductItemProviderFormProps {
  productItemForm: ReturnType<typeof useFormik<IProductItem>>;
}

export default function ProductItemProviderForm({
  productItemForm,
}: ProductItemProviderFormProps) {
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
    const updated = [...productItemForm.values.providers];
    updated.splice(index, 1);
    productItemForm.setFieldValue('providers', updated);
    setExpandedIndexes((prev) => prev.filter((i) => i !== index));
  };

  const handleCheckProductItemProvider = async (
    provider: IProductItemProviderResponse,
    index: number,
  ) => {
    const providerId = provider.providerId;
    const productItemId = provider.id;

    if (!providerId || !productItemId) {
      await Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณาเลือกร้านและใส่รหัสสินค้าก่อนทำการยืนยัน',
        confirmButtonText: 'ตกลง',
      });
      return;
    }

    try {
      const response = await axiosInstance.post<IProductItemProviderResponse>(
        `/providers/check-product-items/${providerId}`,
        {
          productItemId,
        },
      );

      const data = response.data;

      productItemForm.setFieldValue(
        `providers[${index}].name`,
        data.name || '',
      );
      productItemForm.setFieldValue(
        `providers[${index}].price`,
        data.price || 0,
      );
      productItemForm.setFieldValue(
        `providers[${index}].quantity`,
        data.quantity || 0,
      );
      productItemForm.setFieldValue(
        `providers[${index}].purchasable`,
        data.purchasable || 0,
      );
    } catch (error) {
      console.error('Error checking productItem provider:', error);
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
    const updated = [...productItemForm.values.providers];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    productItemForm.setFieldValue('providers', updated);
  };

  const moveProviderDown = (index: number) => {
    if (index === productItemForm.values.providers.length - 1) return;
    const updated = [...productItemForm.values.providers];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    productItemForm.setFieldValue('providers', updated);
  };

  const handleProviderSelectChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: number,
  ) => {
    const selectedProviderId = event.target.value;
    productItemForm.setFieldValue(
      `providers[${index}].providerId`,
      selectedProviderId,
    );

    productItemForm.setFieldValue(`providers[${index}].name`, '');
    productItemForm.setFieldValue(`providers[${index}].price`, 0);
    productItemForm.setFieldValue(`providers[${index}].quantity`, 0);
    productItemForm.setFieldValue(`providers[${index}].purchasable`, 0);
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
            {productItemForm.values.providers?.map((provider, index) => {
              const isExpanded = expandedIndexes.includes(index);

              const isVerified = provider.name != '' && provider.price != 0;
              const matchedProvider = providers.find(
                (p) => p._id === provider.providerId,
              );
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
                          <BsFillCaretUpFill size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn btn-light btn-sm p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            moveProviderDown(index);
                          }}
                          disabled={
                            index ===
                            productItemForm.values.providers.length - 1
                          }
                        >
                          <BsFillCaretDownFill size={16} />
                        </button>
                      </div>
                      {isVerified && (
                        <img
                          src={matchedProvider?.imageUrl}
                          alt={matchedProvider?.name}
                          className="rounded-4"
                          style={{
                            height: '50px',
                            width: '50px',
                            objectFit: 'cover',
                          }}
                        />
                      )}
                      <div className="d-flex flex-column">
                        <span
                          className="badge text-white rounded-pill px-3 py-1 mb-1"
                          style={{
                            fontSize: '0.75rem',
                            backgroundColor: '#16DBCC',
                          }}
                        >
                          {truncateText(
                            matchedProvider?.name || 'ไม่ทราบชื่อร้าน',
                            40,
                          )}
                        </span>
                        <span
                          className="fw-semibold"
                          style={{ fontSize: '0.9rem' }}
                        >
                          {truncateText(
                            provider.name || `ตัวแทน #${index + 1}`,
                            14,
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="provider-actions">
                      <button
                        type="button"
                        className="btn-check-provider"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckProductItemProvider(provider, index);
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
                          onChange={productItemForm.handleChange}
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
                            productItemForm.handleChange(event);

                            productItemForm.setFieldValue(
                              `providers[${index}].name`,
                              '',
                            );
                            productItemForm.setFieldValue(
                              `providers[${index}].price`,
                              0,
                            );
                            productItemForm.setFieldValue(
                              `providers[${index}].quantity`,
                              0,
                            );
                            productItemForm.setFieldValue(
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
              productItemForm.setFieldValue('providers', [
                ...(productItemForm.values.providers || []),
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
