export enum ApiUrl {
    DataProducts = '/api/data_products',
    DataProductGet = '/api/data_products/:dataProductId',
    // DataProductGet = '/api/lineage/',
    DataProductType = '/api/data_product_types',
    DataProductSignInUrl = 'https://dbc-8ccb2fdc-c542.cloud.databricks.com',
    DataProductConveyorNotebookUrl = '/api/data_products/:dataProductId/conveyor_notebook_url',
    DataProductConveyorIdeUrl = '/api/data_products/:dataProductId/conveyor_ide_url',
    DataProductDataset = '/api/data_products/:dataProductId/dataset/:datasetId',
    DataProductAbout = '/api/data_products/:dataProductId/about',
    DataProductMembershipAdd = '/api/data_product_memberships/create',
    DataProductMembershipUpdate = '/api/data_product_memberships/:membershipId/role',
    DataProductMembershipRequest = '/api/data_product_memberships/request',
    DataProductMembershipApprove = '/api/data_product_memberships/:membershipId/approve',
    DataProductMembershipDeny = '/api/data_product_memberships/:membershipId/deny',
    DataProductMembershipRemove = '/api/data_product_memberships/:membershipId/remove',
    Users = '/api/users',
    UserDataProducts = '/api/data_products/user/:userId',
    UserDatasets = '/api/datasets/user/:userId',
    Authorize = '/api/auth/user',
    Environments = '/api/envs',
    Datasets = '/api/datasets',
    DatasetUser = '/api/datasets/:datasetId/user/:userId',
    DatasetGet = '/api/datasets/:datasetId',
    DatasetAbout = '/api/datasets/:datasetId/about',
    BusinessAreas = '/api/business_areas',
    DataProductsDatasets = '/api/data_product_dataset_links',
    DataProductDatasetLinkApprove = '/api/data_product_dataset_links/approve/:datasetLinkId',
    DataProductDatasetLinkReject = '/api/data_product_dataset_links/deny/:datasetLinkId',
    DataProductDatasetLinkRemove = '/api/data_product_dataset_links/remove/:datasetLinkId',
}

export type DynamicPathParams = 'dataProductId' | 'userId' | 'datasetId' | 'datasetLinkId' | 'membershipId';

export function buildUrl(url: string, pathParams: Partial<Record<DynamicPathParams | string, string>>): string {
    const builtUrl = Object.keys(pathParams).reduce((acc, key) => {
        if (pathParams[key]) {
            return acc.replace(`/:${key}`, `/${pathParams[key]}`);
        } else {
            // Remove the segment if the parameter is missing
            return acc.replace(`/:${key}`, '');
        }
    }, url).replace(/\/+$/, ''); // Remove any trailing slashes

    console.log('Built URL:', builtUrl); // Print the final URL

    return builtUrl;
}


