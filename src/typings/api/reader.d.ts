declare namespace Api {
  /** 阅读器配置模块 */
  namespace Reader {
    /** 配置项属性 */
    interface ConfigItem {
      id: number;
      name: string;
      group: string;
      key: string;
      value_type: 'string' | 'number' | 'boolean' | 'json';
      value: string;
      parsed_value: any; // 后端已解析的数据结构
      is_visible: boolean;
      sort_order: number;
      desc: string;
      updated_at: string;
    }

    /** 管理端列表参数 */
    interface ConfigSearchParams {
      skip?: number;
      limit?: number;
    }

    /** 创建配置项 */
    interface ConfigCreate {
      name: string;
      group: string;
      key: string;
      value_type: 'string' | 'number' | 'boolean' | 'json';
      value: string;
      is_visible?: boolean;
      sort_order?: number;
      desc?: string;
    }

    /** 更新配置项 */
    interface ConfigUpdate {
      name?: string;
      group?: string;
      value?: string;
      is_visible?: boolean;
      sort_order?: number;
      desc?: string;
    }
  }
}
