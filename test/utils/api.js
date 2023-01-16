import request from './request';

export const bundleAnnotationInsert = async data => {
  return await request({
    url: '/CaseBundleAPI/BundleAnnotationInsert',
    method: 'post',
    data: data
  })
}
