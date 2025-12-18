import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums";
import type * as Prisma from "../internal/prismaNamespace";
export type UserModel = runtime.Types.Result.DefaultSelection<Prisma.$UserPayload>;
export type AggregateUser = {
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
export type UserMinAggregateOutputType = {
    id: string | null;
    email: string | null;
    fullName: string | null;
    password: string | null;
    isEmailVerified: boolean | null;
    googleId: string | null;
    currency: string | null;
    role: $Enums.UserRole | null;
    status: $Enums.UserStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserMaxAggregateOutputType = {
    id: string | null;
    email: string | null;
    fullName: string | null;
    password: string | null;
    isEmailVerified: boolean | null;
    googleId: string | null;
    currency: string | null;
    role: $Enums.UserRole | null;
    status: $Enums.UserStatus | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type UserCountAggregateOutputType = {
    id: number;
    email: number;
    fullName: number;
    password: number;
    isEmailVerified: number;
    googleId: number;
    currency: number;
    role: number;
    status: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type UserMinAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    password?: true;
    isEmailVerified?: true;
    googleId?: true;
    currency?: true;
    role?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserMaxAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    password?: true;
    isEmailVerified?: true;
    googleId?: true;
    currency?: true;
    role?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type UserCountAggregateInputType = {
    id?: true;
    email?: true;
    fullName?: true;
    password?: true;
    isEmailVerified?: true;
    googleId?: true;
    currency?: true;
    role?: true;
    status?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type UserAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | UserCountAggregateInputType;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type GetUserAggregateType<T extends UserAggregateArgs> = {
    [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateUser[P]> : Prisma.GetScalarType<T[P], AggregateUser[P]>;
};
export type UserGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithAggregationInput | Prisma.UserOrderByWithAggregationInput[];
    by: Prisma.UserScalarFieldEnum[] | Prisma.UserScalarFieldEnum;
    having?: Prisma.UserScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: UserCountAggregateInputType | true;
    _min?: UserMinAggregateInputType;
    _max?: UserMaxAggregateInputType;
};
export type UserGroupByOutputType = {
    id: string;
    email: string;
    fullName: string | null;
    password: string | null;
    isEmailVerified: boolean;
    googleId: string | null;
    currency: string;
    role: $Enums.UserRole;
    status: $Enums.UserStatus;
    createdAt: Date;
    updatedAt: Date;
    _count: UserCountAggregateOutputType | null;
    _min: UserMinAggregateOutputType | null;
    _max: UserMaxAggregateOutputType | null;
};
type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<UserGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]> : Prisma.GetScalarType<T[P], UserGroupByOutputType[P]>;
}>>;
export type UserWhereInput = {
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    id?: Prisma.StringFilter<"User"> | string;
    email?: Prisma.StringFilter<"User"> | string;
    fullName?: Prisma.StringNullableFilter<"User"> | string | null;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    isEmailVerified?: Prisma.BoolFilter<"User"> | boolean;
    googleId?: Prisma.StringNullableFilter<"User"> | string | null;
    currency?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFilter<"User"> | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    transactions?: Prisma.TransactionListRelationFilter;
    categories?: Prisma.CategoryListRelationFilter;
    budgets?: Prisma.BudgetListRelationFilter;
    otps?: Prisma.OtpListRelationFilter;
    sessions?: Prisma.SessionListRelationFilter;
    subscription?: Prisma.XOR<Prisma.SubscriptionNullableScalarRelationFilter, Prisma.SubscriptionWhereInput> | null;
    payments?: Prisma.PaymentListRelationFilter;
};
export type UserOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    isEmailVerified?: Prisma.SortOrder;
    googleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    transactions?: Prisma.TransactionOrderByRelationAggregateInput;
    categories?: Prisma.CategoryOrderByRelationAggregateInput;
    budgets?: Prisma.BudgetOrderByRelationAggregateInput;
    otps?: Prisma.OtpOrderByRelationAggregateInput;
    sessions?: Prisma.SessionOrderByRelationAggregateInput;
    subscription?: Prisma.SubscriptionOrderByWithRelationInput;
    payments?: Prisma.PaymentOrderByRelationAggregateInput;
};
export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string;
    email?: string;
    googleId?: string;
    AND?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    OR?: Prisma.UserWhereInput[];
    NOT?: Prisma.UserWhereInput | Prisma.UserWhereInput[];
    fullName?: Prisma.StringNullableFilter<"User"> | string | null;
    password?: Prisma.StringNullableFilter<"User"> | string | null;
    isEmailVerified?: Prisma.BoolFilter<"User"> | boolean;
    currency?: Prisma.StringFilter<"User"> | string;
    role?: Prisma.EnumUserRoleFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFilter<"User"> | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"User"> | Date | string;
    transactions?: Prisma.TransactionListRelationFilter;
    categories?: Prisma.CategoryListRelationFilter;
    budgets?: Prisma.BudgetListRelationFilter;
    otps?: Prisma.OtpListRelationFilter;
    sessions?: Prisma.SessionListRelationFilter;
    subscription?: Prisma.XOR<Prisma.SubscriptionNullableScalarRelationFilter, Prisma.SubscriptionWhereInput> | null;
    payments?: Prisma.PaymentListRelationFilter;
}, "id" | "email" | "googleId">;
export type UserOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    fullName?: Prisma.SortOrderInput | Prisma.SortOrder;
    password?: Prisma.SortOrderInput | Prisma.SortOrder;
    isEmailVerified?: Prisma.SortOrder;
    googleId?: Prisma.SortOrderInput | Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.UserCountOrderByAggregateInput;
    _max?: Prisma.UserMaxOrderByAggregateInput;
    _min?: Prisma.UserMinOrderByAggregateInput;
};
export type UserScalarWhereWithAggregatesInput = {
    AND?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    OR?: Prisma.UserScalarWhereWithAggregatesInput[];
    NOT?: Prisma.UserScalarWhereWithAggregatesInput | Prisma.UserScalarWhereWithAggregatesInput[];
    id?: Prisma.StringWithAggregatesFilter<"User"> | string;
    email?: Prisma.StringWithAggregatesFilter<"User"> | string;
    fullName?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    password?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    isEmailVerified?: Prisma.BoolWithAggregatesFilter<"User"> | boolean;
    googleId?: Prisma.StringNullableWithAggregatesFilter<"User"> | string | null;
    currency?: Prisma.StringWithAggregatesFilter<"User"> | string;
    role?: Prisma.EnumUserRoleWithAggregatesFilter<"User"> | $Enums.UserRole;
    status?: Prisma.EnumUserStatusWithAggregatesFilter<"User"> | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"User"> | Date | string;
};
export type UserCreateInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateManyInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type UserUpdateManyMutationInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserUncheckedUpdateManyInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type UserCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    isEmailVerified?: Prisma.SortOrder;
    googleId?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    isEmailVerified?: Prisma.SortOrder;
    googleId?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    email?: Prisma.SortOrder;
    fullName?: Prisma.SortOrder;
    password?: Prisma.SortOrder;
    isEmailVerified?: Prisma.SortOrder;
    googleId?: Prisma.SortOrder;
    currency?: Prisma.SortOrder;
    role?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type UserNullableScalarRelationFilter = {
    is?: Prisma.UserWhereInput | null;
    isNot?: Prisma.UserWhereInput | null;
};
export type UserScalarRelationFilter = {
    is?: Prisma.UserWhereInput;
    isNot?: Prisma.UserWhereInput;
};
export type StringFieldUpdateOperationsInput = {
    set?: string;
};
export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null;
};
export type BoolFieldUpdateOperationsInput = {
    set?: boolean;
};
export type EnumUserRoleFieldUpdateOperationsInput = {
    set?: $Enums.UserRole;
};
export type EnumUserStatusFieldUpdateOperationsInput = {
    set?: $Enums.UserStatus;
};
export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string;
};
export type UserCreateNestedOneWithoutCategoriesInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCategoriesInput, Prisma.UserUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCategoriesInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneWithoutCategoriesNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutCategoriesInput, Prisma.UserUncheckedCreateWithoutCategoriesInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutCategoriesInput;
    upsert?: Prisma.UserUpsertWithoutCategoriesInput;
    disconnect?: Prisma.UserWhereInput | boolean;
    delete?: Prisma.UserWhereInput | boolean;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutCategoriesInput, Prisma.UserUpdateWithoutCategoriesInput>, Prisma.UserUncheckedUpdateWithoutCategoriesInput>;
};
export type UserCreateNestedOneWithoutTransactionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTransactionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutTransactionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutTransactionsInput;
    upsert?: Prisma.UserUpsertWithoutTransactionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutTransactionsInput, Prisma.UserUpdateWithoutTransactionsInput>, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
};
export type UserCreateNestedOneWithoutBudgetsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBudgetsInput, Prisma.UserUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBudgetsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutBudgetsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutBudgetsInput, Prisma.UserUncheckedCreateWithoutBudgetsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutBudgetsInput;
    upsert?: Prisma.UserUpsertWithoutBudgetsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutBudgetsInput, Prisma.UserUpdateWithoutBudgetsInput>, Prisma.UserUncheckedUpdateWithoutBudgetsInput>;
};
export type UserCreateNestedOneWithoutOtpsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOtpsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutOtpsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutOtpsInput;
    upsert?: Prisma.UserUpsertWithoutOtpsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutOtpsInput, Prisma.UserUpdateWithoutOtpsInput>, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
};
export type UserCreateNestedOneWithoutSessionsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSessionsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSessionsInput;
    upsert?: Prisma.UserUpsertWithoutSessionsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSessionsInput, Prisma.UserUpdateWithoutSessionsInput>, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserCreateNestedOneWithoutSubscriptionInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionInput, Prisma.UserUncheckedCreateWithoutSubscriptionInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubscriptionInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutSubscriptionNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionInput, Prisma.UserUncheckedCreateWithoutSubscriptionInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutSubscriptionInput;
    upsert?: Prisma.UserUpsertWithoutSubscriptionInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutSubscriptionInput, Prisma.UserUpdateWithoutSubscriptionInput>, Prisma.UserUncheckedUpdateWithoutSubscriptionInput>;
};
export type UserCreateNestedOneWithoutPaymentsInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentsInput;
    connect?: Prisma.UserWhereUniqueInput;
};
export type UserUpdateOneRequiredWithoutPaymentsNestedInput = {
    create?: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    connectOrCreate?: Prisma.UserCreateOrConnectWithoutPaymentsInput;
    upsert?: Prisma.UserUpsertWithoutPaymentsInput;
    connect?: Prisma.UserWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.UserUpdateToOneWithWhereWithoutPaymentsInput, Prisma.UserUpdateWithoutPaymentsInput>, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
};
export type UserCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutCategoriesInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutCategoriesInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutCategoriesInput, Prisma.UserUncheckedCreateWithoutCategoriesInput>;
};
export type UserUpsertWithoutCategoriesInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutCategoriesInput, Prisma.UserUncheckedUpdateWithoutCategoriesInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutCategoriesInput, Prisma.UserUncheckedCreateWithoutCategoriesInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutCategoriesInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutCategoriesInput, Prisma.UserUncheckedUpdateWithoutCategoriesInput>;
};
export type UserUpdateWithoutCategoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutCategoriesInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutTransactionsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutTransactionsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutTransactionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
};
export type UserUpsertWithoutTransactionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutTransactionsInput, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutTransactionsInput, Prisma.UserUncheckedCreateWithoutTransactionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutTransactionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutTransactionsInput, Prisma.UserUncheckedUpdateWithoutTransactionsInput>;
};
export type UserUpdateWithoutTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutTransactionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutBudgetsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutBudgetsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutBudgetsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutBudgetsInput, Prisma.UserUncheckedCreateWithoutBudgetsInput>;
};
export type UserUpsertWithoutBudgetsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutBudgetsInput, Prisma.UserUncheckedUpdateWithoutBudgetsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutBudgetsInput, Prisma.UserUncheckedCreateWithoutBudgetsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutBudgetsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutBudgetsInput, Prisma.UserUncheckedUpdateWithoutBudgetsInput>;
};
export type UserUpdateWithoutBudgetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutBudgetsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutOtpsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutOtpsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutOtpsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
};
export type UserUpsertWithoutOtpsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutOtpsInput, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutOtpsInput, Prisma.UserUncheckedCreateWithoutOtpsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutOtpsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutOtpsInput, Prisma.UserUncheckedUpdateWithoutOtpsInput>;
};
export type UserUpdateWithoutOtpsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutOtpsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSessionsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSessionsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
};
export type UserUpsertWithoutSessionsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSessionsInput, Prisma.UserUncheckedCreateWithoutSessionsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSessionsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSessionsInput, Prisma.UserUncheckedUpdateWithoutSessionsInput>;
};
export type UserUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSessionsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutSubscriptionInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    payments?: Prisma.PaymentCreateNestedManyWithoutUserInput;
};
export type UserUncheckedCreateWithoutSubscriptionInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    payments?: Prisma.PaymentUncheckedCreateNestedManyWithoutUserInput;
};
export type UserCreateOrConnectWithoutSubscriptionInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionInput, Prisma.UserUncheckedCreateWithoutSubscriptionInput>;
};
export type UserUpsertWithoutSubscriptionInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutSubscriptionInput, Prisma.UserUncheckedUpdateWithoutSubscriptionInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutSubscriptionInput, Prisma.UserUncheckedCreateWithoutSubscriptionInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutSubscriptionInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutSubscriptionInput, Prisma.UserUncheckedUpdateWithoutSubscriptionInput>;
};
export type UserUpdateWithoutSubscriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    payments?: Prisma.PaymentUpdateManyWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutSubscriptionInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    payments?: Prisma.PaymentUncheckedUpdateManyWithoutUserNestedInput;
};
export type UserCreateWithoutPaymentsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionCreateNestedOneWithoutUserInput;
};
export type UserUncheckedCreateWithoutPaymentsInput = {
    id?: string;
    email: string;
    fullName?: string | null;
    password?: string | null;
    isEmailVerified?: boolean;
    googleId?: string | null;
    currency?: string;
    role?: $Enums.UserRole;
    status?: $Enums.UserStatus;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transactions?: Prisma.TransactionUncheckedCreateNestedManyWithoutUserInput;
    categories?: Prisma.CategoryUncheckedCreateNestedManyWithoutUserInput;
    budgets?: Prisma.BudgetUncheckedCreateNestedManyWithoutUserInput;
    otps?: Prisma.OtpUncheckedCreateNestedManyWithoutUserInput;
    sessions?: Prisma.SessionUncheckedCreateNestedManyWithoutUserInput;
    subscription?: Prisma.SubscriptionUncheckedCreateNestedOneWithoutUserInput;
};
export type UserCreateOrConnectWithoutPaymentsInput = {
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
};
export type UserUpsertWithoutPaymentsInput = {
    update: Prisma.XOR<Prisma.UserUpdateWithoutPaymentsInput, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
    create: Prisma.XOR<Prisma.UserCreateWithoutPaymentsInput, Prisma.UserUncheckedCreateWithoutPaymentsInput>;
    where?: Prisma.UserWhereInput;
};
export type UserUpdateToOneWithWhereWithoutPaymentsInput = {
    where?: Prisma.UserWhereInput;
    data: Prisma.XOR<Prisma.UserUpdateWithoutPaymentsInput, Prisma.UserUncheckedUpdateWithoutPaymentsInput>;
};
export type UserUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUpdateOneWithoutUserNestedInput;
};
export type UserUncheckedUpdateWithoutPaymentsInput = {
    id?: Prisma.StringFieldUpdateOperationsInput | string;
    email?: Prisma.StringFieldUpdateOperationsInput | string;
    fullName?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    password?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    isEmailVerified?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    googleId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    currency?: Prisma.StringFieldUpdateOperationsInput | string;
    role?: Prisma.EnumUserRoleFieldUpdateOperationsInput | $Enums.UserRole;
    status?: Prisma.EnumUserStatusFieldUpdateOperationsInput | $Enums.UserStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    transactions?: Prisma.TransactionUncheckedUpdateManyWithoutUserNestedInput;
    categories?: Prisma.CategoryUncheckedUpdateManyWithoutUserNestedInput;
    budgets?: Prisma.BudgetUncheckedUpdateManyWithoutUserNestedInput;
    otps?: Prisma.OtpUncheckedUpdateManyWithoutUserNestedInput;
    sessions?: Prisma.SessionUncheckedUpdateManyWithoutUserNestedInput;
    subscription?: Prisma.SubscriptionUncheckedUpdateOneWithoutUserNestedInput;
};
export type UserCountOutputType = {
    transactions: number;
    categories: number;
    budgets: number;
    otps: number;
    sessions: number;
    payments: number;
};
export type UserCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | UserCountOutputTypeCountTransactionsArgs;
    categories?: boolean | UserCountOutputTypeCountCategoriesArgs;
    budgets?: boolean | UserCountOutputTypeCountBudgetsArgs;
    otps?: boolean | UserCountOutputTypeCountOtpsArgs;
    sessions?: boolean | UserCountOutputTypeCountSessionsArgs;
    payments?: boolean | UserCountOutputTypeCountPaymentsArgs;
};
export type UserCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserCountOutputTypeSelect<ExtArgs> | null;
};
export type UserCountOutputTypeCountTransactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TransactionWhereInput;
};
export type UserCountOutputTypeCountCategoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CategoryWhereInput;
};
export type UserCountOutputTypeCountBudgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.BudgetWhereInput;
};
export type UserCountOutputTypeCountOtpsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.OtpWhereInput;
};
export type UserCountOutputTypeCountSessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SessionWhereInput;
};
export type UserCountOutputTypeCountPaymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PaymentWhereInput;
};
export type UserSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    fullName?: boolean;
    password?: boolean;
    isEmailVerified?: boolean;
    googleId?: boolean;
    currency?: boolean;
    role?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    transactions?: boolean | Prisma.User$transactionsArgs<ExtArgs>;
    categories?: boolean | Prisma.User$categoriesArgs<ExtArgs>;
    budgets?: boolean | Prisma.User$budgetsArgs<ExtArgs>;
    otps?: boolean | Prisma.User$otpsArgs<ExtArgs>;
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    subscription?: boolean | Prisma.User$subscriptionArgs<ExtArgs>;
    payments?: boolean | Prisma.User$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["user"]>;
export type UserSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    fullName?: boolean;
    password?: boolean;
    isEmailVerified?: boolean;
    googleId?: boolean;
    currency?: boolean;
    role?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    email?: boolean;
    fullName?: boolean;
    password?: boolean;
    isEmailVerified?: boolean;
    googleId?: boolean;
    currency?: boolean;
    role?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
}, ExtArgs["result"]["user"]>;
export type UserSelectScalar = {
    id?: boolean;
    email?: boolean;
    fullName?: boolean;
    password?: boolean;
    isEmailVerified?: boolean;
    googleId?: boolean;
    currency?: boolean;
    role?: boolean;
    status?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type UserOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "email" | "fullName" | "password" | "isEmailVerified" | "googleId" | "currency" | "role" | "status" | "createdAt" | "updatedAt", ExtArgs["result"]["user"]>;
export type UserInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    transactions?: boolean | Prisma.User$transactionsArgs<ExtArgs>;
    categories?: boolean | Prisma.User$categoriesArgs<ExtArgs>;
    budgets?: boolean | Prisma.User$budgetsArgs<ExtArgs>;
    otps?: boolean | Prisma.User$otpsArgs<ExtArgs>;
    sessions?: boolean | Prisma.User$sessionsArgs<ExtArgs>;
    subscription?: boolean | Prisma.User$subscriptionArgs<ExtArgs>;
    payments?: boolean | Prisma.User$paymentsArgs<ExtArgs>;
    _count?: boolean | Prisma.UserCountOutputTypeDefaultArgs<ExtArgs>;
};
export type UserIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type UserIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $UserPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "User";
    objects: {
        transactions: Prisma.$TransactionPayload<ExtArgs>[];
        categories: Prisma.$CategoryPayload<ExtArgs>[];
        budgets: Prisma.$BudgetPayload<ExtArgs>[];
        otps: Prisma.$OtpPayload<ExtArgs>[];
        sessions: Prisma.$SessionPayload<ExtArgs>[];
        subscription: Prisma.$SubscriptionPayload<ExtArgs> | null;
        payments: Prisma.$PaymentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: string;
        email: string;
        fullName: string | null;
        password: string | null;
        isEmailVerified: boolean;
        googleId: string | null;
        currency: string;
        role: $Enums.UserRole;
        status: $Enums.UserStatus;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["user"]>;
    composites: {};
};
export type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$UserPayload, S>;
export type UserCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<UserFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: UserCountAggregateInputType | true;
};
export interface UserDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['User'];
        meta: {
            name: 'User';
        };
    };
    findUnique<T extends UserFindUniqueArgs>(args: Prisma.SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends UserFindFirstArgs>(args?: Prisma.SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends UserFindManyArgs>(args?: Prisma.SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends UserCreateArgs>(args: Prisma.SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends UserCreateManyArgs>(args?: Prisma.SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends UserCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, UserCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends UserDeleteArgs>(args: Prisma.SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends UserUpdateArgs>(args: Prisma.SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends UserDeleteManyArgs>(args?: Prisma.SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends UserUpdateManyArgs>(args: Prisma.SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends UserUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, UserUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends UserUpsertArgs>(args: Prisma.SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma.Prisma__UserClient<runtime.Types.Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends UserCountArgs>(args?: Prisma.Subset<T, UserCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], UserCountAggregateOutputType> : number>;
    aggregate<T extends UserAggregateArgs>(args: Prisma.Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>;
    groupBy<T extends UserGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: UserGroupByArgs['orderBy'];
    } : {
        orderBy?: UserGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: UserFieldRefs;
}
export interface Prisma__UserClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    transactions<T extends Prisma.User$transactionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$transactionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TransactionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    categories<T extends Prisma.User$categoriesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$categoriesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CategoryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    budgets<T extends Prisma.User$budgetsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$budgetsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$BudgetPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    otps<T extends Prisma.User$otpsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$otpsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$OtpPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    sessions<T extends Prisma.User$sessionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$sessionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SessionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    subscription<T extends Prisma.User$subscriptionArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$subscriptionArgs<ExtArgs>>): Prisma.Prisma__SubscriptionClient<runtime.Types.Result.GetResult<Prisma.$SubscriptionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    payments<T extends Prisma.User$paymentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.User$paymentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PaymentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface UserFieldRefs {
    readonly id: Prisma.FieldRef<"User", 'String'>;
    readonly email: Prisma.FieldRef<"User", 'String'>;
    readonly fullName: Prisma.FieldRef<"User", 'String'>;
    readonly password: Prisma.FieldRef<"User", 'String'>;
    readonly isEmailVerified: Prisma.FieldRef<"User", 'Boolean'>;
    readonly googleId: Prisma.FieldRef<"User", 'String'>;
    readonly currency: Prisma.FieldRef<"User", 'String'>;
    readonly role: Prisma.FieldRef<"User", 'UserRole'>;
    readonly status: Prisma.FieldRef<"User", 'UserStatus'>;
    readonly createdAt: Prisma.FieldRef<"User", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"User", 'DateTime'>;
}
export type UserFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput | Prisma.UserOrderByWithRelationInput[];
    cursor?: Prisma.UserWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.UserScalarFieldEnum | Prisma.UserScalarFieldEnum[];
};
export type UserCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
};
export type UserCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.UserCreateManyInput | Prisma.UserCreateManyInput[];
    skipDuplicates?: boolean;
};
export type UserUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
    where: Prisma.UserWhereUniqueInput;
};
export type UserUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.UserUpdateManyMutationInput, Prisma.UserUncheckedUpdateManyInput>;
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type UserUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
    create: Prisma.XOR<Prisma.UserCreateInput, Prisma.UserUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.UserUpdateInput, Prisma.UserUncheckedUpdateInput>;
};
export type UserDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
    where: Prisma.UserWhereUniqueInput;
};
export type UserDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.UserWhereInput;
    limit?: number;
};
export type User$transactionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TransactionSelect<ExtArgs> | null;
    omit?: Prisma.TransactionOmit<ExtArgs> | null;
    include?: Prisma.TransactionInclude<ExtArgs> | null;
    where?: Prisma.TransactionWhereInput;
    orderBy?: Prisma.TransactionOrderByWithRelationInput | Prisma.TransactionOrderByWithRelationInput[];
    cursor?: Prisma.TransactionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TransactionScalarFieldEnum | Prisma.TransactionScalarFieldEnum[];
};
export type User$categoriesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CategorySelect<ExtArgs> | null;
    omit?: Prisma.CategoryOmit<ExtArgs> | null;
    include?: Prisma.CategoryInclude<ExtArgs> | null;
    where?: Prisma.CategoryWhereInput;
    orderBy?: Prisma.CategoryOrderByWithRelationInput | Prisma.CategoryOrderByWithRelationInput[];
    cursor?: Prisma.CategoryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CategoryScalarFieldEnum | Prisma.CategoryScalarFieldEnum[];
};
export type User$budgetsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$otpsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type User$sessionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SessionSelect<ExtArgs> | null;
    omit?: Prisma.SessionOmit<ExtArgs> | null;
    include?: Prisma.SessionInclude<ExtArgs> | null;
    where?: Prisma.SessionWhereInput;
    orderBy?: Prisma.SessionOrderByWithRelationInput | Prisma.SessionOrderByWithRelationInput[];
    cursor?: Prisma.SessionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SessionScalarFieldEnum | Prisma.SessionScalarFieldEnum[];
};
export type User$subscriptionArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SubscriptionSelect<ExtArgs> | null;
    omit?: Prisma.SubscriptionOmit<ExtArgs> | null;
    include?: Prisma.SubscriptionInclude<ExtArgs> | null;
    where?: Prisma.SubscriptionWhereInput;
};
export type User$paymentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PaymentSelect<ExtArgs> | null;
    omit?: Prisma.PaymentOmit<ExtArgs> | null;
    include?: Prisma.PaymentInclude<ExtArgs> | null;
    where?: Prisma.PaymentWhereInput;
    orderBy?: Prisma.PaymentOrderByWithRelationInput | Prisma.PaymentOrderByWithRelationInput[];
    cursor?: Prisma.PaymentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PaymentScalarFieldEnum | Prisma.PaymentScalarFieldEnum[];
};
export type UserDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.UserSelect<ExtArgs> | null;
    omit?: Prisma.UserOmit<ExtArgs> | null;
    include?: Prisma.UserInclude<ExtArgs> | null;
};
export {};
