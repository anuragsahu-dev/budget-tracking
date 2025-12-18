import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type BudgetModel = runtime.Types.Result.DefaultSelection<Prisma.$BudgetPayload>;
export type AggregateBudget = {
    _count: BudgetCountAggregateOutputType | null;
    _avg: BudgetAvgAggregateOutputType | null;
    _sum: BudgetSumAggregateOutputType | null;
    _min: BudgetMinAggregateOutputType | null;
    _max: BudgetMaxAggregateOutputType | null;
};
export type BudgetAvgAggregateOutputType = {
    month: number | null;
    year: number | null;
    totalLimit: runtime.Decimal | null;
};
export type BudgetSumAggregateOutputType = {
    month: number | null;
    year: number | null;
    totalLimit: runtime.Decimal | null;
};
export type BudgetMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    month: number | null;
    year: number | null;
    totalLimit: runtime.Decimal | null;
    note: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BudgetMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    month: number | null;
    year: number | null;
    totalLimit: runtime.Decimal | null;
    note: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type BudgetCountAggregateOutputType = {
    id: number;
    userId: number;
    month: number;
    year: number;
    totalLimit: number;
    note: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type BudgetAvgAggregateInputType = {
    month?: true;
    year?: true;
    totalLimit?: true;
};
export type BudgetSumAggregateInputType = {
    month?: true;
    year?: true;
    totalLimit?: true;
};
export type BudgetMinAggregateInputType = {
    id?: true;
    userId?: true;
    month?: true;
    year?: true;
    totalLimit?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BudgetMaxAggregateInputType = {
    id?: true;
    userId?: true;
    month?: true;
    year?: true;
    totalLimit?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type BudgetCountAggregateInputType = {
    id?: true;
    userId?: true;
    month?: true;
    year?: true;
    totalLimit?: true;
    note?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type BudgetAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetWhereInput;
    orderBy?: Prisma.BudgetOrderByWithRelationInput | Prisma.BudgetOrderByWithRelationInput[];
    cursor?: Prisma.BudgetWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | BudgetCountAggregateInputType;
    _avg?: BudgetAvgAggregateInputType;
    _sum?: BudgetSumAggregateInputType;
    _min?: BudgetMinAggregateInputType;
    _max?: BudgetMaxAggregateInputType;
};
export type GetBudgetAggregateType<T extends BudgetAggregateArgs> = {
    [P in keyof T & keyof AggregateBudget]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateBudget[P]> : Prisma.GetScalarType<T[P], AggregateBudget[P]>;
};
export type BudgetGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetWhereInput;
    orderBy?: Prisma.BudgetOrderByWithAggregationInput | Prisma.BudgetOrderByWithAggregationInput[];
    by: Prisma.BudgetScalarFieldEnum[] | Prisma.BudgetScalarFieldEnum;
    having?: Prisma.BudgetScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: BudgetCountAggregateInputType | true;
    _avg?: BudgetAvgAggregateInputType;
    _sum?: BudgetSumAggregateInputType;
    _min?: BudgetMinAggregateInputType;
    _max?: BudgetMaxAggregateInputType;
};
export type BudgetGroupByOutputType = {
    id: string;
    userId: string;
    month: number;
    year: number;
    totalLimit: runtime.Decimal | null;
    note: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: BudgetCountAggregateOutputType | null;
    _avg: BudgetAvgAggregateOutputType | null;
    _sum: BudgetSumAggregateOutputType | null;
    _min: BudgetMinAggregateOutputType | null;
    _max: BudgetMaxAggregateOutputType | null;
};
type GetBudgetGroupByPayload<T extends BudgetGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<BudgetGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof BudgetGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], BudgetGroupByOutputType[P]> : Prisma.GetScalarType<T[P], BudgetGroupByOutputType[P]>;
}>>;
export type BudgetWhereInput = {
    AND?: Prisma.BudgetWhereInput | Prisma.BudgetWhereInput[];
    OR?: Prisma.BudgetWhereInput[];
    NOT?: Prisma.BudgetWhereInput | Prisma.BudgetWhereInput[];
    id?: Prisma.StringFilter<"Budget"> | string;
    userId?: Prisma.StringFilter<"Budget"> | string;
    month?: Prisma.IntFilter<"Budget"> | number;
    year?: Prisma.IntFilter<"Budget"> | number;
    totalLimit?: Prisma.DecimalNullableFilter<"Budget"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableFilter<"Budget"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    allocations?: Prisma.BudgetAllocationListRelationFilter;
};
export type BudgetOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
    allocations?: Prisma.BudgetAllocationOrderByRelationAggregateInput;
};
export type BudgetWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    userId_month_year?: Prisma.BudgetUserIdMonthYearCompoundUniqueInput;
    AND?: Prisma.BudgetWhereInput | Prisma.BudgetWhereInput[];
    OR?: Prisma.BudgetWhereInput[];
    NOT?: Prisma.BudgetWhereInput | Prisma.BudgetWhereInput[];
    userId?: Prisma.StringFilter<"Budget"> | string;
    month?: Prisma.IntFilter<"Budget"> | number;
    year?: Prisma.IntFilter<"Budget"> | number;
    totalLimit?: Prisma.DecimalNullableFilter<"Budget"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableFilter<"Budget"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
    allocations?: Prisma.BudgetAllocationListRelationFilter;
}, "id" | "userId_month_year">;
export type BudgetOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrderInput | Prisma.SortOrder;
    note?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.BudgetCountOrderByAggregateInput;
    _avg?: Prisma.BudgetAvgOrderByAggregateInput;
    _max?: Prisma.BudgetMaxOrderByAggregateInput;
    _min?: Prisma.BudgetMinOrderByAggregateInput;
    _sum?: Prisma.BudgetSumOrderByAggregateInput;
};
export type BudgetScalarWhereWithAggregatesInput = {
    AND?: Prisma.BudgetScalarWhereWithAggregatesInput | Prisma.BudgetScalarWhereWithAggregatesInput[];
    OR?: Prisma.BudgetScalarWhereWithAggregatesInput[];
    NOT?: Prisma.BudgetScalarWhereWithAggregatesInput | Prisma.BudgetScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Budget"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Budget"> | string;
    month?: Prisma.IntWithAggregatesFilter<"Budget"> | number;
    year?: Prisma.IntWithAggregatesFilter<"Budget"> | number;
    totalLimit?: Prisma.DecimalNullableWithAggregatesFilter<"Budget"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableWithAggregatesFilter<"Budget"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Budget"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Budget"> | Date | string;
};
export type BudgetCreateInput = {
    id?: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutBudgetsInput;
    allocations?: Prisma.BudgetAllocationCreateNestedManyWithoutBudgetInput;
};
export type BudgetUncheckedCreateInput = {
    id?: string;
    userId: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    allocations?: Prisma.BudgetAllocationUncheckedCreateNestedManyWithoutBudgetInput;
};
export type BudgetUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutBudgetsNestedInput;
    allocations?: Prisma.BudgetAllocationUpdateManyWithoutBudgetNestedInput;
};
export type BudgetUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    allocations?: Prisma.BudgetAllocationUncheckedUpdateManyWithoutBudgetNestedInput;
};
export type BudgetCreateManyInput = {
    id?: string;
    userId: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BudgetUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BudgetUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BudgetListRelationFilter = {
    every?: Prisma.BudgetWhereInput;
    some?: Prisma.BudgetWhereInput;
    none?: Prisma.BudgetWhereInput;
};
export type BudgetOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type BudgetUserIdMonthYearCompoundUniqueInput = {
    userId: string;
    month: number;
    year: number;
};
export type BudgetCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BudgetAvgOrderByAggregateInput = {
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrder;
};
export type BudgetMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BudgetMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrder;
    note?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type BudgetSumOrderByAggregateInput = {
    month?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    totalLimit?: Prisma.SortOrder;
};
export type BudgetScalarRelationFilter = {
    is?: Prisma.BudgetWhereInput;
    isNot?: Prisma.BudgetWhereInput;
};
export type BudgetCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput> | Prisma.BudgetCreateWithoutUserInput[] | Prisma.BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutUserInput | Prisma.BudgetCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BudgetCreateManyUserInputEnvelope;
    connect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
};
export type BudgetUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput> | Prisma.BudgetCreateWithoutUserInput[] | Prisma.BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutUserInput | Prisma.BudgetCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.BudgetCreateManyUserInputEnvelope;
    connect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
};
export type BudgetUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput> | Prisma.BudgetCreateWithoutUserInput[] | Prisma.BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutUserInput | Prisma.BudgetCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BudgetUpsertWithWhereUniqueWithoutUserInput | Prisma.BudgetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BudgetCreateManyUserInputEnvelope;
    set?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    disconnect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    delete?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    connect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    update?: Prisma.BudgetUpdateWithWhereUniqueWithoutUserInput | Prisma.BudgetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BudgetUpdateManyWithWhereWithoutUserInput | Prisma.BudgetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BudgetScalarWhereInput | Prisma.BudgetScalarWhereInput[];
};
export type BudgetUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput> | Prisma.BudgetCreateWithoutUserInput[] | Prisma.BudgetUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutUserInput | Prisma.BudgetCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.BudgetUpsertWithWhereUniqueWithoutUserInput | Prisma.BudgetUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.BudgetCreateManyUserInputEnvelope;
    set?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    disconnect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    delete?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    connect?: Prisma.BudgetWhereUniqueInput | Prisma.BudgetWhereUniqueInput[];
    update?: Prisma.BudgetUpdateWithWhereUniqueWithoutUserInput | Prisma.BudgetUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.BudgetUpdateManyWithWhereWithoutUserInput | Prisma.BudgetUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.BudgetScalarWhereInput | Prisma.BudgetScalarWhereInput[];
};
export type IntFieldUpdateOperationsInput = {
    set?: number;
    increment?: number;
    decrement?: number;
    multiply?: number;
    divide?: number;
};
export type NullableDecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type BudgetCreateNestedOneWithoutAllocationsInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutAllocationsInput, Prisma.BudgetUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutAllocationsInput;
    connect?: Prisma.BudgetWhereUniqueInput;
};
export type BudgetUpdateOneRequiredWithoutAllocationsNestedInput = {
    create?: Prisma.XOR<Prisma.BudgetCreateWithoutAllocationsInput, Prisma.BudgetUncheckedCreateWithoutAllocationsInput>;
    connectOrCreate?: Prisma.BudgetCreateOrConnectWithoutAllocationsInput;
    upsert?: Prisma.BudgetUpsertWithoutAllocationsInput;
    connect?: Prisma.BudgetWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.BudgetUpdateToOneWithWhereWithoutAllocationsInput, Prisma.BudgetUpdateWithoutAllocationsInput>, Prisma.BudgetUncheckedUpdateWithoutAllocationsInput>;
};
export type BudgetCreateWithoutUserInput = {
    id?: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    allocations?: Prisma.BudgetAllocationCreateNestedManyWithoutBudgetInput;
};
export type BudgetUncheckedCreateWithoutUserInput = {
    id?: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    allocations?: Prisma.BudgetAllocationUncheckedCreateNestedManyWithoutBudgetInput;
};
export type BudgetCreateOrConnectWithoutUserInput = {
    where: Prisma.BudgetWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput>;
};
export type BudgetCreateManyUserInputEnvelope = {
    data: Prisma.BudgetCreateManyUserInput | Prisma.BudgetCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type BudgetUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.BudgetWhereUniqueInput;
    update: Prisma.XOR<Prisma.BudgetUpdateWithoutUserInput, Prisma.BudgetUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.BudgetCreateWithoutUserInput, Prisma.BudgetUncheckedCreateWithoutUserInput>;
};
export type BudgetUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.BudgetWhereUniqueInput;
    data: Prisma.XOR<Prisma.BudgetUpdateWithoutUserInput, Prisma.BudgetUncheckedUpdateWithoutUserInput>;
};
export type BudgetUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.BudgetScalarWhereInput;
    data: Prisma.XOR<Prisma.BudgetUpdateManyMutationInput, Prisma.BudgetUncheckedUpdateManyWithoutUserInput>;
};
export type BudgetScalarWhereInput = {
    AND?: Prisma.BudgetScalarWhereInput | Prisma.BudgetScalarWhereInput[];
    OR?: Prisma.BudgetScalarWhereInput[];
    NOT?: Prisma.BudgetScalarWhereInput | Prisma.BudgetScalarWhereInput[];
    id?: Prisma.StringFilter<"Budget"> | string;
    userId?: Prisma.StringFilter<"Budget"> | string;
    month?: Prisma.IntFilter<"Budget"> | number;
    year?: Prisma.IntFilter<"Budget"> | number;
    totalLimit?: Prisma.DecimalNullableFilter<"Budget"> | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.StringNullableFilter<"Budget"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Budget"> | Date | string;
};
export type BudgetCreateWithoutAllocationsInput = {
    id?: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutBudgetsInput;
};
export type BudgetUncheckedCreateWithoutAllocationsInput = {
    id?: string;
    userId: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BudgetCreateOrConnectWithoutAllocationsInput = {
    where: Prisma.BudgetWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetCreateWithoutAllocationsInput, Prisma.BudgetUncheckedCreateWithoutAllocationsInput>;
};
export type BudgetUpsertWithoutAllocationsInput = {
    update: Prisma.XOR<Prisma.BudgetUpdateWithoutAllocationsInput, Prisma.BudgetUncheckedUpdateWithoutAllocationsInput>;
    create: Prisma.XOR<Prisma.BudgetCreateWithoutAllocationsInput, Prisma.BudgetUncheckedCreateWithoutAllocationsInput>;
    where?: Prisma.BudgetWhereInput;
};
export type BudgetUpdateToOneWithWhereWithoutAllocationsInput = {
    where?: Prisma.BudgetWhereInput;
    data: Prisma.XOR<Prisma.BudgetUpdateWithoutAllocationsInput, Prisma.BudgetUncheckedUpdateWithoutAllocationsInput>;
};
export type BudgetUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutBudgetsNestedInput;
};
export type BudgetUncheckedUpdateWithoutAllocationsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BudgetCreateManyUserInput = {
    id?: string;
    month: number;
    year: number;
    totalLimit?: runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type BudgetUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    allocations?: Prisma.BudgetAllocationUpdateManyWithoutBudgetNestedInput;
};
export type BudgetUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    allocations?: Prisma.BudgetAllocationUncheckedUpdateManyWithoutBudgetNestedInput;
};
export type BudgetUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    month?: Prisma.IntFieldUpdateOperationsInput | number;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    totalLimit?: Prisma.NullableDecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string | null;
    note?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type BudgetCountOutputType = {
    allocations: number;
};
export type BudgetCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    allocations?: boolean | BudgetCountOutputTypeCountAllocationsArgs;
};
export type BudgetCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetCountOutputTypeSelect<ExtArgs> | null;
};
export type BudgetCountOutputTypeCountAllocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetAllocationWhereInput;
};
export type BudgetSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    month?: boolean;
    year?: boolean;
    totalLimit?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    allocations?: boolean | Prisma.Budget$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.BudgetCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budget"]>;
export type BudgetSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    month?: boolean;
    year?: boolean;
    totalLimit?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budget"]>;
export type BudgetSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    month?: boolean;
    year?: boolean;
    totalLimit?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["budget"]>;
export type BudgetSelectScalar = {
    id?: boolean;
    userId?: boolean;
    month?: boolean;
    year?: boolean;
    totalLimit?: boolean;
    note?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type BudgetOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "month" | "year" | "totalLimit" | "note" | "createdAt" | "updatedAt", ExtArgs["result"]["budget"]>;
export type BudgetInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
    allocations?: boolean | Prisma.Budget$allocationsArgs<ExtArgs>;
    _count?: boolean | Prisma.BudgetCountOutputTypeDefaultArgs<ExtArgs>;
};
export type BudgetIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type BudgetIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $BudgetPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Budget";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
        allocations: Prisma.$BudgetAllocationPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        month: number;
        year: number;
        totalLimit: runtime.Decimal | null;
        note: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["budget"]>;
    composites: {};
};
export type BudgetGetPayload<S extends boolean | null | undefined | BudgetDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$BudgetPayload, S>;
export type BudgetCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<BudgetFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: BudgetCountAggregateInputType | true;
};
export interface BudgetDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Budget'];
        meta: {
            name: 'Budget';
        };
    };
    findUnique<T extends BudgetFindUniqueArgs>(args: Prisma.SelectSubset<T, BudgetFindUniqueArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends BudgetFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, BudgetFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends BudgetFindFirstArgs>(args?: Prisma.SelectSubset<T, BudgetFindFirstArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends BudgetFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, BudgetFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends BudgetFindManyArgs>(args?: Prisma.SelectSubset<T, BudgetFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends BudgetCreateArgs>(args: Prisma.SelectSubset<T, BudgetCreateArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends BudgetCreateManyArgs>(args?: Prisma.SelectSubset<T, BudgetCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends BudgetCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, BudgetCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends BudgetDeleteArgs>(args: Prisma.SelectSubset<T, BudgetDeleteArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends BudgetUpdateArgs>(args: Prisma.SelectSubset<T, BudgetUpdateArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends BudgetDeleteManyArgs>(args?: Prisma.SelectSubset<T, BudgetDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends BudgetUpdateManyArgs>(args: Prisma.SelectSubset<T, BudgetUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends BudgetUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, BudgetUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends BudgetUpsertArgs>(args: Prisma.SelectSubset<T, BudgetUpsertArgs<ExtArgs>>): Prisma.Prisma__BudgetClient<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends BudgetCountArgs>(args?: Prisma.Subset<T, BudgetCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], BudgetCountAggregateOutputType> : number>;
    aggregate<T extends BudgetAggregateArgs>(args: Prisma.Subset<T, BudgetAggregateArgs>): Prisma.PrismaPromise<GetBudgetAggregateType<T>>;
    groupBy<T extends BudgetGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: BudgetGroupByArgs['orderBy'];
    } : {
        orderBy?: BudgetGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, BudgetGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetBudgetGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: BudgetFieldRefs;
}
export interface Prisma__BudgetClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    allocations<T extends Prisma.Budget$allocationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Budget$allocationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetAllocationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface BudgetFieldRefs {
    readonly id: Prisma.FieldRef<"Budget", 'String'>;
    readonly userId: Prisma.FieldRef<"Budget", 'String'>;
    readonly month: Prisma.FieldRef<"Budget", 'Int'>;
    readonly year: Prisma.FieldRef<"Budget", 'Int'>;
    readonly totalLimit: Prisma.FieldRef<"Budget", 'Decimal'>;
    readonly note: Prisma.FieldRef<"Budget", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Budget", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Budget", 'DateTime'>;
}
export type BudgetFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where: Prisma.BudgetWhereUniqueInput;
};
export type BudgetFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where: Prisma.BudgetWhereUniqueInput;
};
export type BudgetFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where?: Prisma.BudgetWhereInput;
    orderBy?: Prisma.BudgetOrderByWithRelationInput | Prisma.BudgetOrderByWithRelationInput[];
    cursor?: Prisma.BudgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetScalarFieldEnum | Prisma.BudgetScalarFieldEnum[];
};
export type BudgetFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where?: Prisma.BudgetWhereInput;
    orderBy?: Prisma.BudgetOrderByWithRelationInput | Prisma.BudgetOrderByWithRelationInput[];
    cursor?: Prisma.BudgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetScalarFieldEnum | Prisma.BudgetScalarFieldEnum[];
};
export type BudgetFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where?: Prisma.BudgetWhereInput;
    orderBy?: Prisma.BudgetOrderByWithRelationInput | Prisma.BudgetOrderByWithRelationInput[];
    cursor?: Prisma.BudgetWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.BudgetScalarFieldEnum | Prisma.BudgetScalarFieldEnum[];
};
export type BudgetCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetCreateInput, Prisma.BudgetUncheckedCreateInput>;
};
export type BudgetCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.BudgetCreateManyInput | Prisma.BudgetCreateManyInput[];
    skipDuplicates?: boolean;
};
export type BudgetCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    data: Prisma.BudgetCreateManyInput | Prisma.BudgetCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.BudgetIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type BudgetUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetUpdateInput, Prisma.BudgetUncheckedUpdateInput>;
    where: Prisma.BudgetWhereUniqueInput;
};
export type BudgetUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.BudgetUpdateManyMutationInput, Prisma.BudgetUncheckedUpdateManyInput>;
    where?: Prisma.BudgetWhereInput;
    limit?: number;
};
export type BudgetUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.BudgetUpdateManyMutationInput, Prisma.BudgetUncheckedUpdateManyInput>;
    where?: Prisma.BudgetWhereInput;
    limit?: number;
    include?: Prisma.BudgetIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type BudgetUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where: Prisma.BudgetWhereUniqueInput;
    create: Prisma.XOR<Prisma.BudgetCreateInput, Prisma.BudgetUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.BudgetUpdateInput, Prisma.BudgetUncheckedUpdateInput>;
};
export type BudgetDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
    where: Prisma.BudgetWhereUniqueInput;
};
export type BudgetDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetWhereInput;
    limit?: number;
};
export type Budget$allocationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type BudgetDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.BudgetSelect<ExtArgs> | null;
    omit?: Prisma.BudgetOmit<ExtArgs> | null;
    include?: Prisma.BudgetInclude<ExtArgs> | null;
};
export {};
