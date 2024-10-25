import awsLogo from '@/assets/icons/aws-logo.svg?react';
import conveyorLogo from '@/assets/icons/conveyor-logo.svg?react';
import databricksLogo from '@/assets/icons/databricks-logo.svg?react';
import jupyerLogo from '@/assets/icons/jupyter-logo.svg?react';
import snowflakeLogo from '@/assets/icons/snowflake-logo.svg?react';
import tableauLogo from '@/assets/icons/tableau-logo.svg?react';
import { DataAccessTileGrid } from '@/components/data-access/data-access-tile-grid/data-access-tile-grid.tsx';
import { DataProductRequestAccessButton } from '@/pages/data-product/components/data-product-request-access-button/data-product-request-access-button.tsx';
import { selectCurrentUser } from '@/store/features/auth/auth-slice.ts';
import {
    useGetDataProductByIdQuery,
    useGetDataProductConveyorIDEUrlMutation,
    useGetDataProductConveyorNotebookUrlMutation,
    useGetDataProductSignInUrlMutation,
} from '@/store/features/data-products/data-products-api-slice.ts';
import { dispatchMessage } from '@/store/features/feedback/utils/dispatch-feedback.ts';
import { DataPlataforms, DataPlatform } from '@/types/data-platform';
import { CustomDropdownItemProps } from '@/types/shared';
import {
    getCanUserAccessDataProductData,
    getDoesUserHaveAnyDataProductMembership,
} from '@/utils/data-product-user-role.helper.ts';
import { Flex } from 'antd';
import { TFunction } from 'i18next';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './data-product-actions.module.scss';

type Props = {
    dataProductId: string;
};

const getDataPlatforms = (t: TFunction): CustomDropdownItemProps<DataPlatform>[] => [
    {
        label: t('AWS'),
        value: DataPlataforms.AWS,
        icon: awsLogo,
        hasMenu: true,
    },
    { label: t('Conveyor'), value: DataPlataforms.Conveyor, icon: conveyorLogo, hasMenu: false },
    { label: t('Jupyter'), value: DataPlataforms.ConveyorNotebook, icon: jupyerLogo, hasMenu: false },
    { label: t('Snowflake'), value: DataPlataforms.Snowflake, icon: snowflakeLogo, disabled: true },
    { label: t('Databricks'), value: DataPlataforms.Databricks, icon: databricksLogo, hasMenu: true },
    { label: t('Tableau'), value: DataPlataforms.Tableau, icon: tableauLogo, disabled: true },
];

export function DataProductActions({ dataProductId }: Props) {
    const { t } = useTranslation();
    const user = useSelector(selectCurrentUser);
    const { data: dataProduct } = useGetDataProductByIdQuery(dataProductId);
    const dataPlatforms = useMemo(() => getDataPlatforms(t), [t]);
    const [getDataProductSignInUrl, { isLoading }] = useGetDataProductSignInUrlMutation();
    const [getConveyorUrl, { isLoading: isConveyorLoading }] = useGetDataProductConveyorIDEUrlMutation();
    const [getConveyorNotebookUrl, { isLoading: isConveyorNotebookLoading }] =
        useGetDataProductConveyorNotebookUrlMutation();

    if (!dataProduct || !user) return null;

    const doesUserHaveAnyDataProductMembership = getDoesUserHaveAnyDataProductMembership(
        user?.id,
        dataProduct?.memberships,
    );
    const canAccessDataProductData = getCanUserAccessDataProductData(user?.id, dataProduct?.memberships);

    async function handleAccessToData(environment: string, dataPlatform: DataPlatform) {
        if (dataPlatform === DataPlataforms.AWS) {
            try {
                const signInUrl = await getDataProductSignInUrl({ id: dataProductId, environment }).unwrap();
                if (signInUrl) {
                    window.open(signInUrl, '_blank');
                } else {
                    dispatchMessage({ content: t('Failed to get sign in url'), type: 'error' });
                }
            } catch (error) {
                dispatchMessage({ content: t('Failed to get sign in url'), type: 'error' });
            }
        }
        if (dataPlatform === DataPlataforms.Databricks) {
            try {
                console.log('Calling buildUrl function');
                const signInUrl = "https://dbc-8ccb2fdc-c542.cloud.databricks.com";
                // const signInUrl = await getDataProductSignInUrl({ id: dataProductId, environment }).unwrap();
                console.log(`Sign-in URL: ${signInUrl}`);
    
                if (signInUrl) {
                    window.open(signInUrl, "Login");
                } else {
                    dispatchMessage({ content: t('Failed to get sign in url'), type: 'error' });
                }
            } catch (error) {
                console.error(error);
                dispatchMessage({ content: t('Failed to get sign in url'), type: 'error' });
            }
        }
    }

    async function handleTileClick(dataPlatform: DataPlatform) {
        switch (dataPlatform) {
            case DataPlataforms.Conveyor:
                try {
                    const url = await getConveyorUrl({ id: dataProductId }).unwrap();
                    if (url) {
                        window.open(url, '_blank');
                    } else {
                        dispatchMessage({
                            type: 'error',
                            content: t('Failed to get Conveyor url'),
                        });
                    }
                } catch (error) {
                    dispatchMessage({
                        type: 'error',
                        content: t('Failed to get Conveyor url'),
                    });
                }
                break;
            case DataPlataforms.ConveyorNotebook:
                try {
                    const url = await getConveyorNotebookUrl({ id: dataProductId }).unwrap();
                    if (url) {
                        window.open(url, '_blank');
                    } else {
                        dispatchMessage({
                            type: 'error',
                            content: t('Failed to get Conveyor Notebook url'),
                        });
                    }
                } catch (error) {
                    dispatchMessage({
                        type: 'error',
                        content: t('Failed to get Conveyor Notebook url'),
                    });
                }
                break;
            default:
                break;
        }
    }

    return (
        <>
            <Flex vertical className={styles.actionsContainer}>
                {!doesUserHaveAnyDataProductMembership && (
                    <DataProductRequestAccessButton dataProductId={dataProductId} userId={user.id} />
                )}
                <Flex vertical className={styles.accessDataContainer}>
                    <DataAccessTileGrid
                        canAccessData={canAccessDataProductData}
                        dataPlatforms={dataPlatforms}
                        onDataPlatformClick={handleAccessToData}
                        onTileClick={handleTileClick}
                        isDisabled={isLoading || !canAccessDataProductData}
                        isLoading={isLoading || isConveyorLoading || isConveyorNotebookLoading}
                    />
                </Flex>
            </Flex>
        </>
    );
}
