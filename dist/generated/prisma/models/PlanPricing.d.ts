import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type PlanPricingModel = runtime.Types.Result.DefaultSelection<Prisma.$PlanPricingPayload>;
export type AggregatePlanPricing = {
    _count: PlanPricingCountAggregateOutputType | null;
    _avg: PlanPricingAvgAggregateOutputType | null;
    _sum: PlanPricingSumAggregateOutputType | null;
    _min: PlanPricingMinAggregateOutputType | null;
    _max: PlanPricingMaxAggregateOutputType | null;
};
export type PlanPricingAvgAggregateOutputType = {
    amount: number | null;
    durationDays: number | null;
};
export type PlanPricingSumAggregateOutputType = {
    amount: number | null;
    durationDays: number | null;
};
export type PlanPricingMinAggregateOutputType = {
    id: string | null;
    plan: $Enums.SubscriptionPlan | null;
    currency: string | null;
    amount: number | null;
    durationDays: number | null;
    isActive: boolean | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlanPricingMaxAggregateOutputType = {
    id: string | null;
    plan: $Enums.SubscriptionPlan | null;
    currency: string | null;
    amount: number | null;
    durationDays: number | null;
    isActive: boolean | null;
    name: string | null;
    description: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type PlanPricingCountAggregateOutputType = {
    id: number;
    plan: number;
    currency: number;
    amount: number;
    durationDays: number;
    isActive: number;
    name: number;
    description: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type PlanPricingAvgAggregateInputType = {
    amount?: true;
    durationDays?: true;
};
export type PlanPricingSumAggregateInputType = {
    amount?: true;
    durationDays?: true;
};
export type PlanPricingMinAggregateInputType = {
    id?: true;
    plan?: true;
    currency?: true;
    amount?: true;
    durationDays?: true;
    isActive?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlanPricingMaxAggregateInputType = {
    id?: true;
    plan?: true;
    currency?: true;
    amount?: true;
    durationDays?: true;
    isActive?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type PlanPricingCountAggregateInputType = {
    id?: true;
    plan?: true;
    currency?: true;
    amount?: true;
    durationDays?: true;
    isActive?: true;
    name?: true;
    description?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type PlanPricingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPricingWhereInput;
    orderBy?: Prisma.PlanPricingOrderByWithRelationInput | Prisma.PlanPricingOrderByWithRelationInput[];
    cursor?: Prisma.PlanPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PlanPricingCountAggregateInputType;
    _avg?: PlanPricingAvgAggregateInputType;
    _sum?: PlanPricingSumAggregateInputType;
    _min?: PlanPricingMinAggregateInputType;
    _max?: PlanPricingMaxAggregateInputType;
};
export type GetPlanPricingAggregateType<T extends PlanPricingAggregateArgs> = {
    [P in keyof T & keyof AggregatePlanPricing]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePlanPricing[P]> : Prisma.GetScalarType<T[P], AggregatePlanPricing[P]>;
};
export type PlanPricingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPricingWhereInput;
    orderBy?: Prisma.PlanPricingOrderByWithAggregationInput | Prisma.PlanPricingOrderByWithAggregationInput[];
    by: Prisma.PlanPricingScalarFieldEnum[] | Prisma.PlanPricingScalarFieldEnum;
    having?: Prisma.PlanPricingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PlanPricingCountAggregateInputType | true;
    _avg?: PlanPricingAvgAggregateInputType;
    _sum?: PlanPricingSumAggregateInputType;
    _min?: PlanPricingMinAggregateInputType;
    _max?: PlanPricingMaxAggregateInputType;
};
export type PlanPricingGroupByOutputType = {
    id: string;
    plan: $Enums.SubscriptionPlan;
    currency: string;
    amount: number;
    durationDays: number;
    isActive: boolean;
    name: string;
    description: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: PlanPricingCountAggregateOutputType | null;
    _avg: PlanPricingAvgAggregateOutputType | null;
    _sum: PlanPricingSumAggregateOutputType | null;
    _min: PlanPricingMinAggregateOutputType | null;
    _max: PlanPricingMaxAggregateOutputType | null;
};
type GetPlanPricingGroupByPayload<T extends PlanPricingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PlanPricingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PlanPricingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PlanPricingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PlanPricingGroupByOutputType[P]>;
}>>;
export type PlanPricingWhereInput = {
    AND?: Prisma.PlanPricingWhereInput | Prisma.PlanPricingWhereInput[];
    OR?: Prisma.PlanPricingWhereInput[];
    NOT?: Prisma.PlanPricingWhereInput | Prisma.PlanPricingWhereInput[];
    id?: Prisma.StringFilter<"PlanPricing"> | string;
    plan?: Prisma.EnumSubscriptionPlanFilter<"PlanPricing"> | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFilter<"PlanPricing"> | string;
    amount?: Prisma.IntFilter<"PlanPricing"> | number;
    durationDays?: Prisma.IntFilter<"PlanPricing"> | number;
    isActive?: Prisma.BoolFilter<"PlanPricing"> | boolean;
    name?: Prisma.StringFilter<"PlanPricing"> | string;
    description?: Prisma.StringNullableFilter<"PlanPricing"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PlanPricing"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PlanPricing"> | Date | string;
};
export type PlanPricingOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanPricingWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    plan_currency?: Prisma.PlanPricingPlanCurrencyCompoundUniqueInput;
    AND?: Prisma.PlanPricingWhereInput | Prisma.PlanPricingWhereInput[];
    OR?: Prisma.PlanPricingWhereInput[];
    NOT?: Prisma.PlanPricingWhereInput | Prisma.PlanPricingWhereInput[];
    plan?: Prisma.EnumSubscriptionPlanFilter<"PlanPricing"> | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFilter<"PlanPricing"> | string;
    amount?: Prisma.IntFilter<"PlanPricing"> | number;
    durationDays?: Prisma.IntFilter<"PlanPricing"> | number;
    isActive?: Prisma.BoolFilter<"PlanPricing"> | boolean;
    name?: Prisma.StringFilter<"PlanPricing"> | string;
    description?: Prisma.StringNullableFilter<"PlanPricing"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"PlanPricing"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"PlanPricing"> | Date | string;
}, "id" | "plan_currency">;
export type PlanPricingOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.PlanPricingCountOrderByAggregateInput;
    _avg?: Prisma.PlanPricingAvgOrderByAggregateInput;
    _max?: Prisma.PlanPricingMaxOrderByAggregateInput;
    _min?: Prisma.PlanPricingMinOrderByAggregateInput;
    _sum?: Prisma.PlanPricingSumOrderByAggregateInput;
};
export type PlanPricingScalarWhereWithAggregatesInput = {
    AND?: Prisma.PlanPricingScalarWhereWithAggregatesInput | Prisma.PlanPricingScalarWhereWithAggregatesInput[];
    OR?: Prisma.PlanPricingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PlanPricingScalarWhereWithAggregatesInput | Prisma.PlanPricingScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"PlanPricing"> | string;
    plan?: Prisma.EnumSubscriptionPlanWithAggregatesFilter<"PlanPricing"> | $Enums.SubscriptionPlan;
    currency?: Prisma.StringWithAggregatesFilter<"PlanPricing"> | string;
    amount?: Prisma.IntWithAggregatesFilter<"PlanPricing"> | number;
    durationDays?: Prisma.IntWithAggregatesFilter<"PlanPricing"> | number;
    isActive?: Prisma.BoolWithAggregatesFilter<"PlanPricing"> | boolean;
    name?: Prisma.StringWithAggregatesFilter<"PlanPricing"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"PlanPricing"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PlanPricing"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"PlanPricing"> | Date | string;
};
export type PlanPricingCreateInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    currency: string;
    amount: number;
    durationDays: number;
    isActive?: boolean;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlanPricingUncheckedCreateInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    currency: string;
    amount: number;
    durationDays: number;
    isActive?: boolean;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlanPricingUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.IntFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPricingUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.IntFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPricingCreateManyInput = {
    id?: string;
    plan: $Enums.SubscriptionPlan;
    currency: string;
    amount: number;
    durationDays: number;
    isActive?: boolean;
    name: string;
    description?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type PlanPricingUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.IntFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPricingUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    plan?: Prisma.EnumSubscriptionPlanFieldUpdateOperationsInput | $Enums.SubscriptionPlan;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.IntFieldUpdateOperationsInput | number;
    durationDays?: Prisma.IntFieldUpdateOperationsInput | number;
    isActive?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PlanPricingPlanCurrencyCompoundUniqueInput = {
    plan: $Enums.SubscriptionPlan;
    currency: string;
};
export type PlanPricingCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanPricingAvgOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
};
export type PlanPricingMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanPricingMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    plan?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
    isActive?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type PlanPricingSumOrderByAggregateInput = {
    amount?: Prisma.SortOrder;
    durationDays?: Prisma.SortOrder;
};
export type PlanPricingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    currency?: boolean;
    amount?: boolean;
    durationDays?: boolean;
    isActive?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["planPricing"]>;
export type PlanPricingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    currency?: boolean;
    amount?: boolean;
    durationDays?: boolean;
    isActive?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["planPricing"]>;
export type PlanPricingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    plan?: boolean;
    currency?: boolean;
    amount?: boolean;
    durationDays?: boolean;
    isActive?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["planPricing"]>;
export type PlanPricingSelectScalar = {
    id?: boolean;
    plan?: boolean;
    currency?: boolean;
    amount?: boolean;
    durationDays?: boolean;
    isActive?: boolean;
    name?: boolean;
    description?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type PlanPricingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "plan" | "currency" | "amount" | "durationDays" | "isActive" | "name" | "description" | "createdAt" | "updatedAt", ExtArgs["result"]["planPricing"]>;
export type $PlanPricingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PlanPricing";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        plan: $Enums.SubscriptionPlan;
        currency: string;
        amount: number;
        durationDays: number;
        isActive: boolean;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["planPricing"]>;
    composites: {};
};
export type PlanPricingGetPayload<S extends boolean | null | undefined | PlanPricingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload, S>;
export type PlanPricingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PlanPricingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PlanPricingCountAggregateInputType | true;
};
export interface PlanPricingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PlanPricing'];
        meta: {
            name: 'PlanPricing';
        };
    };
    findUnique<T extends PlanPricingFindUniqueArgs>(args: Prisma.SelectSubset<T, PlanPricingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PlanPricingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PlanPricingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PlanPricingFindFirstArgs>(args?: Prisma.SelectSubset<T, PlanPricingFindFirstArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PlanPricingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PlanPricingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PlanPricingFindManyArgs>(args?: Prisma.SelectSubset<T, PlanPricingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PlanPricingCreateArgs>(args: Prisma.SelectSubset<T, PlanPricingCreateArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PlanPricingCreateManyArgs>(args?: Prisma.SelectSubset<T, PlanPricingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PlanPricingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PlanPricingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PlanPricingDeleteArgs>(args: Prisma.SelectSubset<T, PlanPricingDeleteArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PlanPricingUpdateArgs>(args: Prisma.SelectSubset<T, PlanPricingUpdateArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PlanPricingDeleteManyArgs>(args?: Prisma.SelectSubset<T, PlanPricingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PlanPricingUpdateManyArgs>(args: Prisma.SelectSubset<T, PlanPricingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PlanPricingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PlanPricingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PlanPricingUpsertArgs>(args: Prisma.SelectSubset<T, PlanPricingUpsertArgs<ExtArgs>>): Prisma.Prisma__PlanPricingClient<runtime.Types.Result.GetResult<Prisma.$PlanPricingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PlanPricingCountArgs>(args?: Prisma.Subset<T, PlanPricingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PlanPricingCountAggregateOutputType> : number>;
    aggregate<T extends PlanPricingAggregateArgs>(args: Prisma.Subset<T, PlanPricingAggregateArgs>): Prisma.PrismaPromise<GetPlanPricingAggregateType<T>>;
    groupBy<T extends PlanPricingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PlanPricingGroupByArgs['orderBy'];
    } : {
        orderBy?: PlanPricingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PlanPricingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPlanPricingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PlanPricingFieldRefs;
}
export interface Prisma__PlanPricingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PlanPricingFieldRefs {
    readonly id: Prisma.FieldRef<"PlanPricing", 'String'>;
    readonly plan: Prisma.FieldRef<"PlanPricing", 'SubscriptionPlan'>;
    readonly currency: Prisma.FieldRef<"PlanPricing", 'String'>;
    readonly amount: Prisma.FieldRef<"PlanPricing", 'Int'>;
    readonly durationDays: Prisma.FieldRef<"PlanPricing", 'Int'>;
    readonly isActive: Prisma.FieldRef<"PlanPricing", 'Boolean'>;
    readonly name: Prisma.FieldRef<"PlanPricing", 'String'>;
    readonly description: Prisma.FieldRef<"PlanPricing", 'String'>;
    readonly createdAt: Prisma.FieldRef<"PlanPricing", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"PlanPricing", 'DateTime'>;
}
export type PlanPricingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where: Prisma.PlanPricingWhereUniqueInput;
};
export type PlanPricingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where: Prisma.PlanPricingWhereUniqueInput;
};
export type PlanPricingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where?: Prisma.PlanPricingWhereInput;
    orderBy?: Prisma.PlanPricingOrderByWithRelationInput | Prisma.PlanPricingOrderByWithRelationInput[];
    cursor?: Prisma.PlanPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPricingScalarFieldEnum | Prisma.PlanPricingScalarFieldEnum[];
};
export type PlanPricingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where?: Prisma.PlanPricingWhereInput;
    orderBy?: Prisma.PlanPricingOrderByWithRelationInput | Prisma.PlanPricingOrderByWithRelationInput[];
    cursor?: Prisma.PlanPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPricingScalarFieldEnum | Prisma.PlanPricingScalarFieldEnum[];
};
export type PlanPricingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where?: Prisma.PlanPricingWhereInput;
    orderBy?: Prisma.PlanPricingOrderByWithRelationInput | Prisma.PlanPricingOrderByWithRelationInput[];
    cursor?: Prisma.PlanPricingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PlanPricingScalarFieldEnum | Prisma.PlanPricingScalarFieldEnum[];
};
export type PlanPricingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPricingCreateInput, Prisma.PlanPricingUncheckedCreateInput>;
};
export type PlanPricingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PlanPricingCreateManyInput | Prisma.PlanPricingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanPricingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    data: Prisma.PlanPricingCreateManyInput | Prisma.PlanPricingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PlanPricingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPricingUpdateInput, Prisma.PlanPricingUncheckedUpdateInput>;
    where: Prisma.PlanPricingWhereUniqueInput;
};
export type PlanPricingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PlanPricingUpdateManyMutationInput, Prisma.PlanPricingUncheckedUpdateManyInput>;
    where?: Prisma.PlanPricingWhereInput;
    limit?: number;
};
export type PlanPricingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PlanPricingUpdateManyMutationInput, Prisma.PlanPricingUncheckedUpdateManyInput>;
    where?: Prisma.PlanPricingWhereInput;
    limit?: number;
};
export type PlanPricingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where: Prisma.PlanPricingWhereUniqueInput;
    create: Prisma.XOR<Prisma.PlanPricingCreateInput, Prisma.PlanPricingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PlanPricingUpdateInput, Prisma.PlanPricingUncheckedUpdateInput>;
};
export type PlanPricingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
    where: Prisma.PlanPricingWhereUniqueInput;
};
export type PlanPricingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PlanPricingWhereInput;
    limit?: number;
};
export type PlanPricingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PlanPricingSelect<ExtArgs> | null;
    omit?: Prisma.PlanPricingOmit<ExtArgs> | null;
};
export {};
