---
icon: pen-to-square
date: 2024-12-11
category:
  - 前端
tag:
  - el-table
  - api
---

# 跨行列设计

##### 前言

使用el-table做跨行跨列表格渲染，接口数据格式为对象数组，即需从对象中提取columns，且需要设置对应的跨行跨列关系。为此要实现一种更优雅的构造方法，即**配置化跨行跨列动态渲染**。
基于element-ui v2.4.11版本，实现对于该版本表格组件，跨行跨列的构造方法可以通过arraySpanMethod构造，由于笔者使用的是vue2写法，vue3雷同使用。

传送门：https://element.eleme.cn/2.4/#/zh-CN/component/table

```javascript
methods: {
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
        if (rowIndex % 2 === 0) {
            if (columnIndex === 0) {

                return [1, 2];
            } else if (columnIndex === 1) {
                return [0, 0];
            }
        }
    }
}
```

<!-- more -->

##### 设计封装方法

```javascript
/**
 * @data 源数据
 * @config 配置
 */
createSpanMethod(data, config) {
    const sortByFields = (list, sortRule) => {
        list.sort((a, b) => {
            for (let rule of sortRule) {
                const { field, order } = rule;
                if (a[field] < b[field]) {
                    return order === 'asc' ? -1 : order === 'desc' ? 1 : 0;
                } else if (a[field] > b[field]) {
                    return order === 'asc' ? 1 : order === 'desc' ? -1 : 0;
                }
            }
            return 0;
        });
    };

    // 默认行合并规则
    const defaultRowRule = (row, column, rowIndex, columnIndex, list, rowConfig, temp, type) => {
        if (type === 'check') {
            return (row[rowConfig.linkField ?? column.property] === list[rowIndex - 1][rowConfig.linkField ?? column.property]);
        } else {
            return (list[temp][rowConfig.linkField ?? column.property] === list[temp + 1][rowConfig.linkField ?? column.property]);
        }
    };

    const setRowSpan = (row, column, rowIndex, columnIndex, list, corSpan, rowConfig) => {
        const exportParams = { row, column, rowIndex, columnIndex, rowConfig };
        if ((rowIndex > 0) && (rowConfig.rule ? rowConfig.rule(list[rowIndex - 1], row, rowConfig.linkField ?? column.property, exportParams) : defaultRowRule(row, column, rowIndex, columnIndex, list, rowConfig, null, 'check'))) {
            corSpan.rowspan = 0;
        } else if (rowIndex === list.length - 1) {
            corSpan.rowspan = 1;
        } else {
            let rowspan = 1;
            let temp = rowIndex;
            while ((temp < list.length - 1) && (rowConfig.rule ? rowConfig.rule(list[temp], list[temp + 1], rowConfig.linkField ?? column.property, exportParams) : defaultRowRule(row, column, rowIndex, columnIndex, list, rowConfig, temp))) {
                temp++;
                rowspan++;
            }
            corSpan.rowspan = rowspan;
        }
    };

    const setColSpan = (row, column, rowIndex, columnIndex, list, corSpan, colConfig) => {
        const exportParams = { row, column, rowIndex, columnIndex, colConfig };
        if (colConfig?.rule(exportParams)) {
            corSpan.colspan = column.property === colConfig?.fields[0].field ? colConfig?.fields.length : 0;
        } else {
            corSpan.colspan = 1;
        }
    };

    if (config.sort) sortByFields(data, config.sortRule ?? []);

    return ({ row, column, rowIndex, columnIndex }) => {
        const corSpan = {
            rowspan: 1,
            colspan: 1
        };
        if (!data.length) return corSpan;

        const linkCellConfig = config?.mergeRow?.find(item => item?.linkField && (item?.columnIndex === columnIndex));
        const rowConfig = config?.mergeRow?.find(item => (item?.field === column.property) && (item?.columnIndex === columnIndex));

        if (linkCellConfig) {
            setRowSpan(row, column, rowIndex, columnIndex, data, corSpan, linkCellConfig);
        } else if (rowConfig) {
            setRowSpan(row, column, rowIndex, columnIndex, data, corSpan, rowConfig);
        }

        const colConfig = config?.mergeCol?.find(item => item?.fields?.some(el => (el?.field === column.property) && (el?.columnIndex === columnIndex)));
        if (colConfig) setColSpan(row, column, rowIndex, columnIndex, data, corSpan, colConfig);

        return corSpan;
    };
}
```

**设计步骤**：

- 进行权重排序。对于无序数据可以配置优先顺序即**索引顺序**从大到小，对于后续行归并有优化作用，开启sort会**更改源数据**
- 定义span-method返回的corSpan，分别计算rowspan、colspan
- 行合并思想，根据当前cell相互比对，根据rule方法返回值决定，如果返回条件成立，则代表此cell应该为跨行初始格，依次两两获取返回值，累计值则为rowspan的值，其余为0（默认行合并规则：配置的field值相等即归并）
- 行合并中，衍生链接格类型，比如行单选格、索引格，需要同步合并时则需要依赖其它field，linkField优先级大于field
- 列合并思想，fields结构按照columns的定义的顺序设置，rule代表合并的规则，数组首元素cell返回条件成立，则代表跨列生效，跨列值为fields定义长度，其余为0（暂不设置默认规则，避免与行合并冲突）
- 设计field、columnIndex双重设置，是保证跨行表格重复列头的情况，跨列是为了避免错误覆盖

**需要注意**的是：如果跨行、跨列中有**重复的field**，合并可能会发生冲突，所以应该保证按我们需要的配置，保证逻辑独立**单一设置**！

##### 调用示例

```vue
<el-table
  :data="tableData"
  :row-key="(row) => row.id"
  highlight-current-row
  @current-change="handleCurrent"
  :span-method="spanMethod"
>
    <el-table-column
        fixed
        type="index"
        align="center"
        width="60"
        :index="index => (page.pageNo - 1) * page.pageSize + index + 1"
    >
        <template #header>{{ lingo("index", "序号") }}</template>
        <template #default="{ row, column, $index }">
            <el-radio :label="row">{{ (page.pageNo - 1) * page.pageSize + $index + 1 }}</el-radio>
        </template>
    </el-table-column>
</el-table>
```

```javascript
// 供span-method消费
this.spanMethod = this.createSpanMethod(this.tableData, {
  sort: true, // 开启排序
  sortRule: [
    // 权重优先级按索引从高到低，order代表升降序：asc/desc
    { field: "containerBarcode", order: "asc" },
    { field: "itemDesc", order: "desc" },
  ],
  mergeRow: [
    // 行合并配置
    // { linkField: 'containerBarcode', columnIndex: 0 }, // 链接格，linkField代表寄生列，优先于field
    { field: "containerBarcode", columnIndex: 1 }, // 普通型
    { field: "itemCode", columnIndex: 2, rule: this.rowRule }, // 自定义合并规则
  ],
  mergeCol: [
    // 列合并配置
    {
      fields: [
        {
          field: "itemDesc",
          columnIndex: 3,
        },
        {
          field: "qty",
          columnIndex: 4,
        },
      ],
      rule: this.colRule, // 自定义合并规则
    },
  ],
});
```

```javascript
// 行归并规则示例
rowRule(currentRow, nextRow, field, { row, column, rowIndex, columnIndex, colConfig }) {
  // 当前cell满足此条件时，则合并
  return currentRow[field] > nextRow[field] && currentRow.qty < 9;
}

// 列归并规则示例
colRule({ row, column, rowIndex, columnIndex, colConfig }) {
  	// 当前cell满足此条件时，则合并
    return row.itemDesc === '1' || row.itemDesc === '555';
}
```

- 分组列头暂未添加其中，后续补充

以上发现有误或者优化的地方，请留言评论~
