import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BudgetAllocationModel = runtime.Types.Result.DefaultSelection<Prisma.$BudgetAllocationPayload>;
export type AggregateBudgetAllocation = {
    _count: BudgetAllocationCountAggregateOutputType | null;
    _avg: BudgetAllocationAvgAggregateOutputType | null;
    _sum: BudgetAllocationSumAggregateOutputType | null;
    _min: BudgetAllocationMinAggregateOutputType | null;
    _max: BudgetAllocationMaxAggregateOutputType | null;
};
export type BudgetAllocationAvgAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type BudgetAllocationSumAggregateOutputType = {
    amount: runtime.Decimal | null;
};
export type BudgetAllocationMinAggregateOutputType = {
    id: string | null;
    budgetId: string | null;
    categoryId: string | null;
    amount: runtime.Decimal | null;
};
export type BudgetAllocationMaxAggregateOutputType = {
    id: string | null;
    budgetId: string | null;
    categoryId: string | null;
    amount: runtime.Decimal | null;
};
export type BudgetAllocationCountAggregateOutputType = {
    id: number;
    budgetId: number;
    categoryId: number;
    amount: number;
    _all: number;
};
export type BudgetAllocationAvgAggregateInputType = {
    amount?: true;
};
export type BudgetAllocationSumAggregateInputType = {
    amount?: true;
};
export type BudgetAllocationMinAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    amount?: true;
};
export type BudgetAllocationMaxAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    amount?: true;
};
export type BudgetAllocationCountAggregateInputType = {
    id?: true;
    budgetId?: true;
    categoryId?: true;
    amount?: true;
    _all?: true;
};
export type BudgetAllocationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetAllocationWhereInput;
    orderBy?: Prisma.BudgetAllocationOrderByWithRelationInput | Prisma.BudgetAllocationOrderByWithRelationInput[];
    cursor?: Prisma.BudgetAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BudgetAllocationCountAggregateInputType;
    _avg?: BudgetAllocationAvgAggregateInputType;
    _sum?: BudgetAllocationSumAggregateInputType;
    _min?: BudgetAllocationMinAggregateInputType;
    _max?: BudgetAllocationMaxAggregateInputType;
};
export type GetBudgetAllocationAggregateType<T extends BudgetAllocationAggregateArgs> = {
    [P in keyof T & keyof AggregateBudgetAllocation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBudgetAllocation[P]> : Prisma.GetScalarType<T[P], AggregateBudgetAllocation[P]>;
};
export type BudgetAllocationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetAllocationWhereInput;
    orderBy?: Prisma.BudgetAllocationOrderByWithAggregationInput | Prisma.BudgetAllocationOrderByWithAggregationInput[];
    by: Prisma.BudgetAllocationScalarFieldEnum[] | Prisma.BudgetAllocationScalarFieldEnum;
    having?: Prisma.BudgetAllocationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BudgetAllocationCountAggregateInputType | true;
    _avg?: BudgetAllocationAvgAggregateInputType;
    _sum?: BudgetAllocationSumAggregateInputType;
    _min?: BudgetAllocationMinAggregateInputType;
    _max?: BudgetAllocationMaxAggregateInputType;
};
export type BudgetAllocationGroupByOutputType = {
    id: string;
    budgetId: string;
    categoryId: string;
    amount: runtime.Decimal;
    _count: BudgetAllocationCountAggregateOutputType | null;
    _avg: BudgetAllocationAvgAggregateOutputType | null;
    _sum: BudgetAllocationSumAggregateOutputType | null;
    _min: BudgetAllocationMinAggregateOutputType | null;
    _max: BudgetAllocationMaxAggregateOutputType | null;
};
type GetBudgetAllocationGroupByPayload<T extends BudgetAllocationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BudgetAllocationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BudgetAllocationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BudgetAllocationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BudgetAllocationGroupByOutputType[P]>;
}>>;
export type BudgetAllocationWhereInput = {
    AND?: Prisma.BudgetAllocationWhereInput | Prisma.BudgetAllocationWhereInput[];
    OR?: Prisma.BudgetAllocationWhereInput[];
    NOT?: Prisma.BudgetAllocationWhereInput | Prisma.BudgetAllocationWhereInput[];
    id?: Prisma.StringFilter<"BudgetAllocation"> | string;
    budgetId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    categoryId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    amount?: Prisma.DecimalFilter<"BudgetAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget?: Prisma.XOR<Prisma.BudgetScalarRelationFilter, Prisma.BudgetWhereInput>;
    category?: Prisma.XOR<Prisma.CategoryScalarRelationFilter, Prisma.CategoryWhereInput>;
};
export type BudgetAllocationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    budgetId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    budget?: Prisma.BudgetOrderByWithRelationInput;
    category?: Prisma.CategoryOrderByWithRelationInput;
};
export type BudgetAllocationWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    budgetId_categoryId?: Prisma.BudgetAllocationBudgetIdCategoryIdCompoundUniqueInput;
    AND?: Prisma.BudgetAllocationWhereInput | Prisma.BudgetAllocationWhereInput[];
    OR?: Prisma.BudgetAllocationWhereInput[];
    NOT?: Prisma.BudgetAllocationWhereInput | Prisma.BudgetAllocationWhereInput[];
    budgetId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    categoryId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    amount?: Prisma.DecimalFilter<"BudgetAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget?: Prisma.XOR<Prisma.BudgetScalarRelationFilter, Prisma.BudgetWhereInput>;
    category?: Prisma.XOR<Prisma.CategoryScalarRelationFilter, Prisma.CategoryWhereInput>;
}, "id" | "budgetId_categoryId">;
export type BudgetAllocationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    budgetId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    _count?: Prisma.BudgetAllocationCountOrderByAggregateInput;
    _avg?: Prisma.BudgetAllocationAvgOrderByAggregateInput;
    _max?: Prisma.BudgetAllocationMaxOrderByAggregateInput;
    _min?: Prisma.BudgetAllocationMinOrderByAggregateInput;
    _sum?: Prisma.BudgetAllocationSumOrderByAggregateInput;
};
export type BudgetAllocationScalarWhereWithAggregatesInput = {
    AND?: Prisma.BudgetAllocationScalarWhereWithAggregatesInput | Prisma.BudgetAllocationScalarWhereWithAggregatesInput[];
    OR?: Prisma.BudgetAllocationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BudgetAllocationScalarWhereWithAggregatesInput | Prisma.BudgetAllocationScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"BudgetAllocation"> | string;
    budgetId?: Prisma.StringWithAggregatesFilter<"BudgetAllocation"> | string;
    categoryId?: Prisma.StringWithAggregatesFilter<"BudgetAllocation"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"BudgetAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget: Prisma.BudgetCreateNestedOneWithoutAllocationsInput;
    category: Prisma.CategoryCreateNestedOneWithoutBudgetAllocationsInput;
};
export type BudgetAllocationUncheckedCreateInput = {
    id?: string;
    budgetId: string;
    categoryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget?: Prisma.BudgetUpdateOneRequiredWithoutAllocationsNestedInput;
    category?: Prisma.CategoryUpdateOneRequiredWithoutBudgetAllocationsNestedInput;
};
export type BudgetAllocationUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    budgetId?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateManyInput = {
    id?: string;
    budgetId: string;
    categoryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    budgetId?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationListRelationFilter = {
    every?: Prisma.BudgetAllocationWhereInput;
    some?: Prisma.BudgetAllocationWhereInput;
    none?: Prisma.BudgetAllocationWhereInput;
};
export type BudgetAllocationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BudgetAllocationBudgetIdCategoryIdCompoundUniqueInput = {
    budgetId: string;
    categoryId: string;
};
export type BudgetAllocationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    budgetId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type BudgetAllocationAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type BudgetAllocationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    budgetId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type BudgetAllocationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    budgetId?: Prisma.SortOrder;
    categoryId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
};
export type BudgetAllocationSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
};
export type BudgetAllocationCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput> | Prisma.BudgetAllocationCreateWithoutCategoryInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput | Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.BudgetAllocationCreateManyCategoryInputEnvelope;
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
};
export type BudgetAllocationUncheckedCreateNestedManyWithoutCategoryInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput> | Prisma.BudgetAllocationCreateWithoutCategoryInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput | Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput[];
    createMany?: Prisma.BudgetAllocationCreateManyCategoryInputEnvelope;
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
};
export type BudgetAllocationUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput> | Prisma.BudgetAllocationCreateWithoutCategoryInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput | Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutCategoryInput | Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.BudgetAllocationCreateManyCategoryInputEnvelope;
    set?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    disconnect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    delete?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    update?: Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutCategoryInput | Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.BudgetAllocationUpdateManyWithWhereWithoutCategoryInput | Prisma.BudgetAllocationUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
};
export type BudgetAllocationUncheckedUpdateManyWithoutCategoryNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput> | Prisma.BudgetAllocationCreateWithoutCategoryInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput | Prisma.BudgetAllocationCreateOrConnectWithoutCategoryInput[];
    upsert?: Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutCategoryInput | Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutCategoryInput[];
    createMany?: Prisma.BudgetAllocationCreateManyCategoryInputEnvelope;
    set?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    disconnect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    delete?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    update?: Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutCategoryInput | Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutCategoryInput[];
    updateMany?: Prisma.BudgetAllocationUpdateManyWithWhereWithoutCategoryInput | Prisma.BudgetAllocationUpdateManyWithWhereWithoutCategoryInput[];
    deleteMany?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
};
export type BudgetAllocationCreateNestedManyWithoutBudgetInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput> | Prisma.BudgetAllocationCreateWithoutBudgetInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput | Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput[];
    createMany?: Prisma.BudgetAllocationCreateManyBudgetInputEnvelope;
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
};
export type BudgetAllocationUncheckedCreateNestedManyWithoutBudgetInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput> | Prisma.BudgetAllocationCreateWithoutBudgetInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput | Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput[];
    createMany?: Prisma.BudgetAllocationCreateManyBudgetInputEnvelope;
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
};
export type BudgetAllocationUpdateManyWithoutBudgetNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput> | Prisma.BudgetAllocationCreateWithoutBudgetInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput | Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput[];
    upsert?: Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutBudgetInput | Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutBudgetInput[];
    createMany?: Prisma.BudgetAllocationCreateManyBudgetInputEnvelope;
    set?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    disconnect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    delete?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    update?: Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutBudgetInput | Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutBudgetInput[];
    updateMany?: Prisma.BudgetAllocationUpdateManyWithWhereWithoutBudgetInput | Prisma.BudgetAllocationUpdateManyWithWhereWithoutBudgetInput[];
    deleteMany?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
};
export type BudgetAllocationUncheckedUpdateManyWithoutBudgetNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput> | Prisma.BudgetAllocationCreateWithoutBudgetInput[] | Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput[];
    connectOrCreate?: Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput | Prisma.BudgetAllocationCreateOrConnectWithoutBudgetInput[];
    upsert?: Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutBudgetInput | Prisma.BudgetAllocationUpsertWithWhereUniqueWithoutBudgetInput[];
    createMany?: Prisma.BudgetAllocationCreateManyBudgetInputEnvelope;
    set?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    disconnect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    delete?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    connect?: Prisma.BudgetAllocationWhereUniqueInput | Prisma.BudgetAllocationWhereUniqueInput[];
    update?: Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutBudgetInput | Prisma.BudgetAllocationUpdateWithWhereUniqueWithoutBudgetInput[];
    updateMany?: Prisma.BudgetAllocationUpdateManyWithWhereWithoutBudgetInput | Prisma.BudgetAllocationUpdateManyWithWhereWithoutBudgetInput[];
    deleteMany?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
};
export type BudgetAllocationCreateWithoutCategoryInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget: Prisma.BudgetCreateNestedOneWithoutAllocationsInput;
};
export type BudgetAllocationUncheckedCreateWithoutCategoryInput = {
    id?: string;
    budgetId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateOrConnectWithoutCategoryInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput>;
};
export type BudgetAllocationCreateManyCategoryInputEnvelope = {
    data: Prisma.BudgetAllocationCreateManyCategoryInput | Prisma.BudgetAllocationCreateManyCategoryInput[];
    skipDuplicates?: boolean;
};
export type BudgetAllocationUpsertWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.BudgetAllocationUpdateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedUpdateWithoutCategoryInput>;
    create: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedCreateWithoutCategoryInput>;
};
export type BudgetAllocationUpdateWithWhereUniqueWithoutCategoryInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateWithoutCategoryInput, Prisma.BudgetAllocationUncheckedUpdateWithoutCategoryInput>;
};
export type BudgetAllocationUpdateManyWithWhereWithoutCategoryInput = {
    where: Prisma.BudgetAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateManyMutationInput, Prisma.BudgetAllocationUncheckedUpdateManyWithoutCategoryInput>;
};
export type BudgetAllocationScalarWhereInput = {
    AND?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
    OR?: Prisma.BudgetAllocationScalarWhereInput[];
    NOT?: Prisma.BudgetAllocationScalarWhereInput | Prisma.BudgetAllocationScalarWhereInput[];
    id?: Prisma.StringFilter<"BudgetAllocation"> | string;
    budgetId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    categoryId?: Prisma.StringFilter<"BudgetAllocation"> | string;
    amount?: Prisma.DecimalFilter<"BudgetAllocation"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateWithoutBudgetInput = {
    id?: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    category: Prisma.CategoryCreateNestedOneWithoutBudgetAllocationsInput;
};
export type BudgetAllocationUncheckedCreateWithoutBudgetInput = {
    id?: string;
    categoryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateOrConnectWithoutBudgetInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput>;
};
export type BudgetAllocationCreateManyBudgetInputEnvelope = {
    data: Prisma.BudgetAllocationCreateManyBudgetInput | Prisma.BudgetAllocationCreateManyBudgetInput[];
    skipDuplicates?: boolean;
};
export type BudgetAllocationUpsertWithWhereUniqueWithoutBudgetInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    update: Prisma.XOR<Prisma.BudgetAllocationUpdateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedUpdateWithoutBudgetInput>;
    create: Prisma.XOR<Prisma.BudgetAllocationCreateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedCreateWithoutBudgetInput>;
};
export type BudgetAllocationUpdateWithWhereUniqueWithoutBudgetInput = {
    where: Prisma.BudgetAllocationWhereUniqueInput;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateWithoutBudgetInput, Prisma.BudgetAllocationUncheckedUpdateWithoutBudgetInput>;
};
export type BudgetAllocationUpdateManyWithWhereWithoutBudgetInput = {
    where: Prisma.BudgetAllocationScalarWhereInput;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateManyMutationInput, Prisma.BudgetAllocationUncheckedUpdateManyWithoutBudgetInput>;
};
export type BudgetAllocationCreateManyCategoryInput = {
    id?: string;
    budgetId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUpdateWithoutCategoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    budget?: Prisma.BudgetUpdateOneRequiredWithoutAllocationsNestedInput;
};
export type BudgetAllocationUncheckedUpdateWithoutCategoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    budgetId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUncheckedUpdateManyWithoutCategoryInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    budgetId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationCreateManyBudgetInput = {
    id?: string;
    categoryId: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUpdateWithoutBudgetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    category?: Prisma.CategoryUpdateOneRequiredWithoutBudgetAllocationsNestedInput;
};
export type BudgetAllocationUncheckedUpdateWithoutBudgetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationUncheckedUpdateManyWithoutBudgetInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    categoryId?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetAllocationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    budgetId?: boolean;
    categoryId?: boolean;
    amount?: boolean;
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budgetAllocation"]>;
export type BudgetAllocationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    budgetId?: boolean;
    categoryId?: boolean;
    amount?: boolean;
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budgetAllocation"]>;
export type BudgetAllocationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    budgetId?: boolean;
    categoryId?: boolean;
    amount?: boolean;
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budgetAllocation"]>;
export type BudgetAllocationSelectScalar = {
    id?: boolean;
    budgetId?: boolean;
    categoryId?: boolean;
    amount?: boolean;
};
export type BudgetAllocationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "budgetId" | "categoryId" | "amount", ExtArgs["result"]["budgetAllocation"]>;
export type BudgetAllocationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type BudgetAllocationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type BudgetAllocationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    budget?: boolean | Prisma.BudgetDefaultArgs<ExtArgs>;
    category?: boolean | Prisma.CategoryDefaultArgs<ExtArgs>;
};
export type $BudgetAllocationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "BudgetAllocation";
    objects: {
        budget: Prisma.$BudgetPayload<ExtArgs>;
        category: Prisma.$CategoryPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        budgetId: string;
        categoryId: string;
        amount: runtime.Decimal;
    }, ExtArgs["result"]["budgetAllocation"]>;
    composites: {};
};
export type BudgetAllocationGetPayload<S extends boolean | null | undefined | BudgetAllocationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload, S>;
export type BudgetAllocationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BudgetAllocationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BudgetAllocationCountAggregateInputType | true;
};
export interface BudgetAllocationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['BudgetAllocation'];
        meta: {
            name: 'BudgetAllocation';
        };
    };
    findUnique<T extends BudgetAllocationFindUniqueArgs>(args: Prisma.SelectSubset<T, BudgetAllocationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BudgetAllocationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BudgetAllocationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BudgetAllocationFindFirstArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationFindFirstArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BudgetAllocationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BudgetAllocationFindManyArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BudgetAllocationCreateArgs>(args: Prisma.SelectSubset<T, BudgetAllocationCreateArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BudgetAllocationCreateManyArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BudgetAllocationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BudgetAllocationDeleteArgs>(args: Prisma.SelectSubset<T, BudgetAllocationDeleteArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BudgetAllocationUpdateArgs>(args: Prisma.SelectSubset<T, BudgetAllocationUpdateArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BudgetAllocationDeleteManyArgs>(args?: Prisma.SelectSubset<T, BudgetAllocationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BudgetAllocationUpdateManyArgs>(args: Prisma.SelectSubset<T, BudgetAllocationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BudgetAllocationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BudgetAllocationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BudgetAllocationUpsertArgs>(args: Prisma.SelectSubset<T, BudgetAllocationUpsertArgs<ExtArgs>>): Prisma.Prisma__BudgetAllocationClient<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BudgetAllocationCountArgs>(args?: Prisma.Subset<T, BudgetAllocationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BudgetAllocationCountAggregateOutputType> : number>;
    aggregate<T extends BudgetAllocationAggregateArgs>(args: Prisma.Subset<T, BudgetAllocationAggregateArgs>): Prisma.PrismaPromise<GetBudgetAllocationAggregateType<T>>;
    groupBy<T extends BudgetAllocationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BudgetAllocationGroupByArgs['orderBy'];
    } : {
        orderBy?: BudgetAllocationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BudgetAllocationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBudgetAllocationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BudgetAllocationFieldRefs;
}
export interface Prisma__BudgetAllocationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    budget<T extends Prisma.BudgetDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.BudgetDefaultArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    category<T extends Prisma.CategoryDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CategoryDefaultArgs<ExtArgs>>): Prisma.Prisma__CategoryClient<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BudgetAllocationFieldRefs {
    readonly id: Prisma.FieldRef<"BudgetAllocation", 'String'>;
    readonly budgetId: Prisma.FieldRef<"BudgetAllocation", 'String'>;
    readonly categoryId: Prisma.FieldRef<"BudgetAllocation", 'String'>;
    readonly amount: Prisma.FieldRef<"BudgetAllocation", 'Decimal'>;
}
export type BudgetAllocationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where: Prisma.BudgetAllocationWhereUniqueInput;
};
export type BudgetAllocationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where: Prisma.BudgetAllocationWhereUniqueInput;
};
export type BudgetAllocationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where?: Prisma.BudgetAllocationWhereInput;
    orderBy?: Prisma.BudgetAllocationOrderByWithRelationInput | Prisma.BudgetAllocationOrderByWithRelationInput[];
    cursor?: Prisma.BudgetAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetAllocationScalarFieldEnum | Prisma.BudgetAllocationScalarFieldEnum[];
};
export type BudgetAllocationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where?: Prisma.BudgetAllocationWhereInput;
    orderBy?: Prisma.BudgetAllocationOrderByWithRelationInput | Prisma.BudgetAllocationOrderByWithRelationInput[];
    cursor?: Prisma.BudgetAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetAllocationScalarFieldEnum | Prisma.BudgetAllocationScalarFieldEnum[];
};
export type BudgetAllocationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where?: Prisma.BudgetAllocationWhereInput;
    orderBy?: Prisma.BudgetAllocationOrderByWithRelationInput | Prisma.BudgetAllocationOrderByWithRelationInput[];
    cursor?: Prisma.BudgetAllocationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetAllocationScalarFieldEnum | Prisma.BudgetAllocationScalarFieldEnum[];
};
export type BudgetAllocationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetAllocationCreateInput, Prisma.BudgetAllocationUncheckedCreateInput>;
};
export type BudgetAllocationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BudgetAllocationCreateManyInput | Prisma.BudgetAllocationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BudgetAllocationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    data: Prisma.BudgetAllocationCreateManyInput | Prisma.BudgetAllocationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BudgetAllocationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BudgetAllocationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateInput, Prisma.BudgetAllocationUncheckedUpdateInput>;
    where: Prisma.BudgetAllocationWhereUniqueInput;
};
export type BudgetAllocationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateManyMutationInput, Prisma.BudgetAllocationUncheckedUpdateManyInput>;
    where?: Prisma.BudgetAllocationWhereInput;
    limit?: number;
};
export type BudgetAllocationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetAllocationUpdateManyMutationInput, Prisma.BudgetAllocationUncheckedUpdateManyInput>;
    where?: Prisma.BudgetAllocationWhereInput;
    limit?: number;
    include?: Prisma.BudgetAllocationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BudgetAllocationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where: Prisma.BudgetAllocationWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetAllocationCreateInput, Prisma.BudgetAllocationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BudgetAllocationUpdateInput, Prisma.BudgetAllocationUncheckedUpdateInput>;
};
export type BudgetAllocationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
    where: Prisma.BudgetAllocationWhereUniqueInput;
};
export type BudgetAllocationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetAllocationWhereInput;
    limit?: number;
};
export type BudgetAllocationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetAllocationSelect<ExtArgs> | null;
    omit?: Prisma.BudgetAllocationOmit<ExtArgs> | null;
    include?: Prisma.BudgetAllocationInclude<ExtArgs> | null;
};
export {};
