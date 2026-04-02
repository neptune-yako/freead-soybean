declare namespace Api {
  /** 用户反馈与问卷模块 */
  namespace Feedback {
    /** 问卷运营概览 */
    interface Overview {
      /** 累计总条数 */
      total_submissions: number;
      /** 今日新增数 */
      today_submissions: number;
      /** 最近 5 条记录预览 */
      latest_records: RecordItem[];
    }

    /** 选项统计项 */
    interface OptionStats {
      label: string;
      count: number;
      percentage: number;
    }

    /** 题目聚合统计 */
    interface QuestionStats {
      question_key: string;
      title: string;
      options: OptionStats[];
    }

    /** 问卷提交记录 */
    interface RecordItem {
      id: number;
      user_id: number;
      user_nickname: string;
      /** 原始问卷数据 (JSON) */
      form_payload: any;
      created_at: string;
    }

    /** 记录查询参数 */
    interface RecordSearchParams {
      skip?: number;
      limit?: number;
    }
  }
}
