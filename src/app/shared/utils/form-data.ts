/**
 * 转化成form-data格式
 * @param obj object类型
 */
export function transFormData(obj:Object): FormData {
  let formData = new FormData();
  for (var i in obj) {
    if (Array.isArray(obj[i])) {
        obj[i].map(item => {
          formData.append(i + '[]', item)
        })
    } else {
        formData.append(i, obj[i])
    }
  }
  return formData;
}
