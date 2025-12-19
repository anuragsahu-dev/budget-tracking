import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace";
export type OtpModel = runtime.Types.Result.DefaultSelection<Prisma.$OtpPayload>;
export type AggregateOtp = {
    _count: OtpCountAggregateOutputType | null;
    _min: OtpMinAggregateOutputType | null;
    _max: OtpMaxAggregateOutputType | null;
};
export type OtpMinAggregateOutputType = {
    id: string | null;
    userId: string | null;
    email: string | null;
    otpHash: string | null;
    expiresAt: Date | null;
    verified: boolean | null;
    createdAt: Date | null;
};
export type OtpMaxAggregateOutputType = {
    id: string | null;
    userId: string | null;
    email: string | null;
    otpHash: string | null;
    expiresAt: Date | null;
    verified: boolean | null;
    createdAt: Date | null;
};
export type OtpCountAggregateOutputType = {
    id: number;
    userId: number;
    email: number;
    otpHash: number;
    expiresAt: number;
    verified: number;
    createdAt: number;
    _all: number;
};
export type OtpMinAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    otpHash?: true;
    expiresAt?: true;
    verified?: true;
    createdAt?: true;
};
export type OtpMaxAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    otpHash?: true;
    expiresAt?: true;
    verified?: true;
    createdAt?: true;
};
export type OtpCountAggregateInputType = {
    id?: true;
    userId?: true;
    email?: true;
    otpHash?: true;
    expiresAt?: true;
    verified?: true;
    createdAt?: true;
    _all?: true;
};
export type OtpAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OtpWhereInput;
    orderBy?: Prisma.OtpOrderByWithRelationInput | Prisma.OtpOrderByWithRelationInput[];
    cursor?: Prisma.OtpWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | OtpCountAggregateInputType;
    _min?: OtpMinAggregateInputType;
    _max?: OtpMaxAggregateInputType;
};
export type GetOtpAggregateType<T extends OtpAggregateArgs> = {
    [P in keyof T & keyof AggregateOtp]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateOtp[P]> : Prisma.GetScalarType<T[P], AggregateOtp[P]>;
};
export type OtpGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OtpWhereInput;
    orderBy?: Prisma.OtpOrderByWithAggregationInput | Prisma.OtpOrderByWithAggregationInput[];
    by: Prisma.OtpScalarFieldEnum[] | Prisma.OtpScalarFieldEnum;
    having?: Prisma.OtpScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: OtpCountAggregateInputType | true;
    _min?: OtpMinAggregateInputType;
    _max?: OtpMaxAggregateInputType;
};
export type OtpGroupByOutputType = {
    id: string;
    userId: string;
    email: string | null;
    otpHash: string;
    expiresAt: Date;
    verified: boolean;
    createdAt: Date;
    _count: OtpCountAggregateOutputType | null;
    _min: OtpMinAggregateOutputType | null;
    _max: OtpMaxAggregateOutputType | null;
};
type GetOtpGroupByPayload<T extends OtpGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<OtpGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof OtpGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], OtpGroupByOutputType[P]> : Prisma.GetScalarType<T[P], OtpGroupByOutputType[P]>;
}>>;
export type OtpWhereInput = {
    AND?: Prisma.OtpWhereInput | Prisma.OtpWhereInput[];
    OR?: Prisma.OtpWhereInput[];
    NOT?: Prisma.OtpWhereInput | Prisma.OtpWhereInput[];
    id?: Prisma.StringFilter<"Otp"> | string;
    userId?: Prisma.StringFilter<"Otp"> | string;
    email?: Prisma.StringNullableFilter<"Otp"> | string | null;
    otpHash?: Prisma.StringFilter<"Otp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
    verified?: Prisma.BoolFilter<"Otp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
};
export type OtpOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    verified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    user?: Prisma.UserOrderByWithRelationInput;
};
export type OtpWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    AND?: Prisma.OtpWhereInput | Prisma.OtpWhereInput[];
    OR?: Prisma.OtpWhereInput[];
    NOT?: Prisma.OtpWhereInput | Prisma.OtpWhereInput[];
    userId?: Prisma.StringFilter<"Otp"> | string;
    email?: Prisma.StringNullableFilter<"Otp"> | string | null;
    otpHash?: Prisma.StringFilter<"Otp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
    verified?: Prisma.BoolFilter<"Otp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
    user?: Prisma.XOR<Prisma.UserScalarRelationFilter, Prisma.UserWhereInput>;
}, "id">;
export type OtpOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrderInput | Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    verified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.OtpCountOrderByAggregateInput;
    _max?: Prisma.OtpMaxOrderByAggregateInput;
    _min?: Prisma.OtpMinOrderByAggregateInput;
};
export type OtpScalarWhereWithAggregatesInput = {
    AND?: Prisma.OtpScalarWhereWithAggregatesInput | Prisma.OtpScalarWhereWithAggregatesInput[];
    OR?: Prisma.OtpScalarWhereWithAggregatesInput[];
    NOT?: Prisma.OtpScalarWhereWithAggregatesInput | Prisma.OtpScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"Otp"> | string;
    userId?: Prisma.StringWithAggregatesFilter<"Otp"> | string;
    email?: Prisma.StringNullableWithAggregatesFilter<"Otp"> | string | null;
    otpHash?: Prisma.StringWithAggregatesFilter<"Otp"> | string;
    expiresAt?: Prisma.DateTimeWithAggregatesFilter<"Otp"> | Date | string;
    verified?: Prisma.BoolWithAggregatesFilter<"Otp"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Otp"> | Date | string;
};
export type OtpCreateInput = {
    id?: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
    user: Prisma.UserCreateNestedOneWithoutOtpsInput;
};
export type OtpUncheckedCreateInput = {
    id?: string;
    userId: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
};
export type OtpUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    user?: Prisma.UserUpdateOneRequiredWithoutOtpsNestedInput;
};
export type OtpUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpCreateManyInput = {
    id?: string;
    userId: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
};
export type OtpUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    userId?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpListRelationFilter = {
    every?: Prisma.OtpWhereInput;
    some?: Prisma.OtpWhereInput;
    none?: Prisma.OtpWhereInput;
};
export type OtpOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type OtpCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    verified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OtpMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    verified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OtpMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    userId?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    otpHash?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    verified?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type OtpCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput> | Prisma.OtpCreateWithoutUserInput[] | Prisma.OtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OtpCreateOrConnectWithoutUserInput | Prisma.OtpCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OtpCreateManyUserInputEnvelope;
    connect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
};
export type OtpUncheckedCreateNestedManyWithoutUserInput = {
    create?: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput> | Prisma.OtpCreateWithoutUserInput[] | Prisma.OtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OtpCreateOrConnectWithoutUserInput | Prisma.OtpCreateOrConnectWithoutUserInput[];
    createMany?: Prisma.OtpCreateManyUserInputEnvelope;
    connect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
};
export type OtpUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput> | Prisma.OtpCreateWithoutUserInput[] | Prisma.OtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OtpCreateOrConnectWithoutUserInput | Prisma.OtpCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OtpUpsertWithWhereUniqueWithoutUserInput | Prisma.OtpUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OtpCreateManyUserInputEnvelope;
    set?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    disconnect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    delete?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    connect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    update?: Prisma.OtpUpdateWithWhereUniqueWithoutUserInput | Prisma.OtpUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OtpUpdateManyWithWhereWithoutUserInput | Prisma.OtpUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OtpScalarWhereInput | Prisma.OtpScalarWhereInput[];
};
export type OtpUncheckedUpdateManyWithoutUserNestedInput = {
    create?: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput> | Prisma.OtpCreateWithoutUserInput[] | Prisma.OtpUncheckedCreateWithoutUserInput[];
    connectOrCreate?: Prisma.OtpCreateOrConnectWithoutUserInput | Prisma.OtpCreateOrConnectWithoutUserInput[];
    upsert?: Prisma.OtpUpsertWithWhereUniqueWithoutUserInput | Prisma.OtpUpsertWithWhereUniqueWithoutUserInput[];
    createMany?: Prisma.OtpCreateManyUserInputEnvelope;
    set?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    disconnect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    delete?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    connect?: Prisma.OtpWhereUniqueInput | Prisma.OtpWhereUniqueInput[];
    update?: Prisma.OtpUpdateWithWhereUniqueWithoutUserInput | Prisma.OtpUpdateWithWhereUniqueWithoutUserInput[];
    updateMany?: Prisma.OtpUpdateManyWithWhereWithoutUserInput | Prisma.OtpUpdateManyWithWhereWithoutUserInput[];
    deleteMany?: Prisma.OtpScalarWhereInput | Prisma.OtpScalarWhereInput[];
};
export type OtpCreateWithoutUserInput = {
    id?: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
};
export type OtpUncheckedCreateWithoutUserInput = {
    id?: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
};
export type OtpCreateOrConnectWithoutUserInput = {
    where: Prisma.OtpWhereUniqueInput;
    create: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput>;
};
export type OtpCreateManyUserInputEnvelope = {
    data: Prisma.OtpCreateManyUserInput | Prisma.OtpCreateManyUserInput[];
    skipDuplicates?: boolean;
};
export type OtpUpsertWithWhereUniqueWithoutUserInput = {
    where: Prisma.OtpWhereUniqueInput;
    update: Prisma.XOR<Prisma.OtpUpdateWithoutUserInput, Prisma.OtpUncheckedUpdateWithoutUserInput>;
    create: Prisma.XOR<Prisma.OtpCreateWithoutUserInput, Prisma.OtpUncheckedCreateWithoutUserInput>;
};
export type OtpUpdateWithWhereUniqueWithoutUserInput = {
    where: Prisma.OtpWhereUniqueInput;
    data: Prisma.XOR<Prisma.OtpUpdateWithoutUserInput, Prisma.OtpUncheckedUpdateWithoutUserInput>;
};
export type OtpUpdateManyWithWhereWithoutUserInput = {
    where: Prisma.OtpScalarWhereInput;
    data: Prisma.XOR<Prisma.OtpUpdateManyMutationInput, Prisma.OtpUncheckedUpdateManyWithoutUserInput>;
};
export type OtpScalarWhereInput = {
    AND?: Prisma.OtpScalarWhereInput | Prisma.OtpScalarWhereInput[];
    OR?: Prisma.OtpScalarWhereInput[];
    NOT?: Prisma.OtpScalarWhereInput | Prisma.OtpScalarWhereInput[];
    id?: Prisma.StringFilter<"Otp"> | string;
    userId?: Prisma.StringFilter<"Otp"> | string;
    email?: Prisma.StringNullableFilter<"Otp"> | string | null;
    otpHash?: Prisma.StringFilter<"Otp"> | string;
    expiresAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
    verified?: Prisma.BoolFilter<"Otp"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"Otp"> | Date | string;
};
export type OtpCreateManyUserInput = {
    id?: string;
    email?: string | null;
    otpHash: string;
    expiresAt: Date | string;
    verified?: boolean;
    createdAt?: Date | string;
};
export type OtpUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpUncheckedUpdateWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpUncheckedUpdateManyWithoutUserInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    otpHash?: Prisma.StringFieldUpdateOperationsInput | string;
    expiresAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    verified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type OtpSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    verified?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["otp"]>;
export type OtpSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    verified?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["otp"]>;
export type OtpSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    verified?: boolean;
    createdAt?: boolean;
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["otp"]>;
export type OtpSelectScalar = {
    id?: boolean;
    userId?: boolean;
    email?: boolean;
    otpHash?: boolean;
    expiresAt?: boolean;
    verified?: boolean;
    createdAt?: boolean;
};
export type OtpOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "userId" | "email" | "otpHash" | "expiresAt" | "verified" | "createdAt", ExtArgs["result"]["otp"]>;
export type OtpInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type OtpIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type OtpIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    user?: boolean | Prisma.UserDefaultArgs<ExtArgs>;
};
export type $OtpPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Otp";
    objects: {
        user: Prisma.$UserPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        userId: string;
        email: string | null;
        otpHash: string;
        expiresAt: Date;
        verified: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["otp"]>;
    composites: {};
};
export type OtpGetPayload<S extends boolean | null | undefined | OtpDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$OtpPayload, S>;
export type OtpCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<OtpFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: OtpCountAggregateInputType | true;
};
export interface OtpDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Otp'];
        meta: {
            name: 'Otp';
        };
    };
    findUnique<T extends OtpFindUniqueArgs>(args: Prisma.SelectSubset<T, OtpFindUniqueArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends OtpFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, OtpFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends OtpFindFirstArgs>(args?: Prisma.SelectSubset<T, OtpFindFirstArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends OtpFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, OtpFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends OtpFindManyArgs>(args?: Prisma.SelectSubset<T, OtpFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends OtpCreateArgs>(args: Prisma.SelectSubset<T, OtpCreateArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends OtpCreateManyArgs>(args?: Prisma.SelectSubset<T, OtpCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends OtpCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, OtpCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends OtpDeleteArgs>(args: Prisma.SelectSubset<T, OtpDeleteArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends OtpUpdateArgs>(args: Prisma.SelectSubset<T, OtpUpdateArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends OtpDeleteManyArgs>(args?: Prisma.SelectSubset<T, OtpDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends OtpUpdateManyArgs>(args: Prisma.SelectSubset<T, OtpUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends OtpUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, OtpUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends OtpUpsertArgs>(args: Prisma.SelectSubset<T, OtpUpsertArgs<ExtArgs>>): Prisma.Prisma__OtpClient<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends OtpCountArgs>(args?: Prisma.Subset<T, OtpCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], OtpCountAggregateOutputType> : number>;
    aggregate<T extends OtpAggregateArgs>(args: Prisma.Subset<T, OtpAggregateArgs>): Prisma.PrismaPromise<GetOtpAggregateType<T>>;
    groupBy<T extends OtpGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: OtpGroupByArgs['orderBy'];
    } : {
        orderBy?: OtpGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, OtpGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOtpGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: OtpFieldRefs;
}
export interface Prisma__OtpClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    user<T extends Prisma.UserDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.UserDefaultArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface OtpFieldRefs {
    readonly id: Prisma.FieldRef<"Otp", 'String'>;
    readonly userId: Prisma.FieldRef<"Otp", 'String'>;
    readonly email: Prisma.FieldRef<"Otp", 'String'>;
    readonly otpHash: Prisma.FieldRef<"Otp", 'String'>;
    readonly expiresAt: Prisma.FieldRef<"Otp", 'DateTime'>;
    readonly verified: Prisma.FieldRef<"Otp", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"Otp", 'DateTime'>;
}
export type OtpFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where: Prisma.OtpWhereUniqueInput;
};
export type OtpFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where: Prisma.OtpWhereUniqueInput;
};
export type OtpFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where?: Prisma.OtpWhereInput;
    orderBy?: Prisma.OtpOrderByWithRelationInput | Prisma.OtpOrderByWithRelationInput[];
    cursor?: Prisma.OtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OtpScalarFieldEnum | Prisma.OtpScalarFieldEnum[];
};
export type OtpFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where?: Prisma.OtpWhereInput;
    orderBy?: Prisma.OtpOrderByWithRelationInput | Prisma.OtpOrderByWithRelationInput[];
    cursor?: Prisma.OtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OtpScalarFieldEnum | Prisma.OtpScalarFieldEnum[];
};
export type OtpFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where?: Prisma.OtpWhereInput;
    orderBy?: Prisma.OtpOrderByWithRelationInput | Prisma.OtpOrderByWithRelationInput[];
    cursor?: Prisma.OtpWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.OtpScalarFieldEnum | Prisma.OtpScalarFieldEnum[];
};
export type OtpCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OtpCreateInput, Prisma.OtpUncheckedCreateInput>;
};
export type OtpCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.OtpCreateManyInput | Prisma.OtpCreateManyInput[];
    skipDuplicates?: boolean;
};
export type OtpCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    data: Prisma.OtpCreateManyInput | Prisma.OtpCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.OtpIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type OtpUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OtpUpdateInput, Prisma.OtpUncheckedUpdateInput>;
    where: Prisma.OtpWhereUniqueInput;
};
export type OtpUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.OtpUpdateManyMutationInput, Prisma.OtpUncheckedUpdateManyInput>;
    where?: Prisma.OtpWhereInput;
    limit?: number;
};
export type OtpUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.OtpUpdateManyMutationInput, Prisma.OtpUncheckedUpdateManyInput>;
    where?: Prisma.OtpWhereInput;
    limit?: number;
    include?: Prisma.OtpIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type OtpUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where: Prisma.OtpWhereUniqueInput;
    create: Prisma.XOR<Prisma.OtpCreateInput, Prisma.OtpUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.OtpUpdateInput, Prisma.OtpUncheckedUpdateInput>;
};
export type OtpDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
    where: Prisma.OtpWhereUniqueInput;
};
export type OtpDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OtpWhereInput;
    limit?: number;
};
export type OtpDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.OtpSelect<ExtArgs> | null;
    omit?: Prisma.OtpOmit<ExtArgs> | null;
    include?: Prisma.OtpInclude<ExtArgs> | null;
};
export {};
