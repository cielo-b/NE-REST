/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from '@tsoa/runtime';
import {  fetchMiddlewares, ExpressTemplateService } from '@tsoa/runtime';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VehicleController } from './../modules/vehicles/vehicle.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UserController } from './../modules/users/users.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ReceiptController } from './../modules/receipts/receipt.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ParkingEntryController } from './../modules/parking-entries/parking-entry.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ParkingController } from './../modules/parking/parking.controller';
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthController } from './../modules/auth/auth.controller';
import { expressAuthentication } from './../middlewares/auth.middleware';
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from 'express';

const expressAuthenticationRecasted = expressAuthentication as (req: ExRequest, securityName: string, scopes?: string[], res?: ExResponse) => Promise<any>;


// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    "ApiResponse": {
        "dataType": "refObject",
        "properties": {
            "status": {"dataType":"string"},
            "message": {"dataType":"string"},
            "success": {"dataType":"boolean","required":true},
            "data": {"dataType":"union","subSchemas":[{"dataType":"nestedObjectLiteral","nestedProperties":{}},{"dataType":"enum","enums":[null]}]},
            "token": {"dataType":"string"},
            "code": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateVehicleDto": {
        "dataType": "refObject",
        "properties": {
            "plateNumber": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateVehicleDto": {
        "dataType": "refObject",
        "properties": {
            "plateNumber": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ERole": {
        "dataType": "refEnum",
        "enums": ["ADMIN","ATTENDANT"],
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "RegisterUserDto": {
        "dataType": "refObject",
        "properties": {
            "firstname": {"dataType":"string","required":true},
            "lastname": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
            "role": {"ref":"ERole","default":"ATTENDANT"},
            "email": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateUserDto": {
        "dataType": "refObject",
        "properties": {
            "firstname": {"dataType":"string"},
            "lastname": {"dataType":"string"},
            "password": {"dataType":"string"},
            "email": {"dataType":"string"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateParkingEntryDto": {
        "dataType": "refObject",
        "properties": {
            "plateNumber": {"dataType":"string","required":true},
            "parkingId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "ExitParkingDto": {
        "dataType": "refObject",
        "properties": {
            "entryId": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "CreateParkingDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string","required":true},
            "address": {"dataType":"string","required":true},
            "price": {"dataType":"double","required":true},
            "numberOfSpaces": {"dataType":"double","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "UpdateParkingDto": {
        "dataType": "refObject",
        "properties": {
            "name": {"dataType":"string"},
            "address": {"dataType":"string"},
            "pricePerHour": {"dataType":"double"},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    "LoginDto": {
        "dataType": "refObject",
        "properties": {
            "email": {"dataType":"string","required":true},
            "password": {"dataType":"string","required":true},
        },
        "additionalProperties": false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {"noImplicitAdditionalProperties":"throw-on-extras","bodyCoercion":true});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa




export function RegisterRoutes(app: Router) {

    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################


    
        const argsVehicleController_createVehicle: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"CreateVehicleDto"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/vehicle',
            authenticateMiddleware([{"bearerAuth":["CUSTOMER"]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.createVehicle)),

            async function VehicleController_createVehicle(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_createVehicle, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'createVehicle',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVehicleController_getAllVehicles: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/vehicle',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.getAllVehicles)),

            async function VehicleController_getAllVehicles(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_getAllVehicles, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'getAllVehicles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVehicleController_getMyVehicles: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/vehicle/my-vehicles',
            authenticateMiddleware([{"bearerAuth":["CUSTOMER"]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.getMyVehicles)),

            async function VehicleController_getMyVehicles(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_getMyVehicles, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'getMyVehicles',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVehicleController_getVehicleById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/vehicle/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.getVehicleById)),

            async function VehicleController_getVehicleById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_getVehicleById, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'getVehicleById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVehicleController_updateVehicle: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                dto: {"in":"body","name":"dto","required":true,"ref":"UpdateVehicleDto"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/vehicle/:id',
            authenticateMiddleware([{"bearerAuth":["CUSTOMER"]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.updateVehicle)),

            async function VehicleController_updateVehicle(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_updateVehicle, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'updateVehicle',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsVehicleController_deleteVehicle: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.delete('/vehicle/:id',
            authenticateMiddleware([{"bearerAuth":["CUSTOMER"]}]),
            ...(fetchMiddlewares<RequestHandler>(VehicleController)),
            ...(fetchMiddlewares<RequestHandler>(VehicleController.prototype.deleteVehicle)),

            async function VehicleController_deleteVehicle(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsVehicleController_deleteVehicle, request, response });

                const controller = new VehicleController();

              await templateService.apiHandler({
                methodName: 'deleteVehicle',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_registerUser: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"RegisterUserDto"},
        };
        app.post('/user/register',
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.registerUser)),

            async function UserController_registerUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_registerUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'registerUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getAllUsers: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/user',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getAllUsers)),

            async function UserController_getAllUsers(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getAllUsers, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getAllUsers',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_getUserById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/user/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.getUserById)),

            async function UserController_getUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_getUserById, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'getUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_deleteUserById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/user/:id',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.deleteUserById)),

            async function UserController_deleteUserById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_deleteUserById, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'deleteUserById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsUserController_updateUser: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                dto: {"in":"body","name":"dto","required":true,"ref":"UpdateUserDto"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.put('/user/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(UserController)),
            ...(fetchMiddlewares<RequestHandler>(UserController.prototype.updateUser)),

            async function UserController_updateUser(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsUserController_updateUser, request, response });

                const controller = new UserController();

              await templateService.apiHandler({
                methodName: 'updateUser',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReceiptController_getReceiptById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/receipt/by-id/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController)),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController.prototype.getReceiptById)),

            async function ReceiptController_getReceiptById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReceiptController_getReceiptById, request, response });

                const controller = new ReceiptController();

              await templateService.apiHandler({
                methodName: 'getReceiptById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReceiptController_getMyReceipts: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/receipt/my-receipts',
            authenticateMiddleware([{"bearerAuth":["CUSTOMER"]}]),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController)),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController.prototype.getMyReceipts)),

            async function ReceiptController_getMyReceipts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReceiptController_getMyReceipts, request, response });

                const controller = new ReceiptController();

              await templateService.apiHandler({
                methodName: 'getMyReceipts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsReceiptController_getAllReceipts: Record<string, TsoaRoute.ParameterSchema> = {
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.get('/receipt',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController)),
            ...(fetchMiddlewares<RequestHandler>(ReceiptController.prototype.getAllReceipts)),

            async function ReceiptController_getAllReceipts(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsReceiptController_getAllReceipts, request, response });

                const controller = new ReceiptController();

              await templateService.apiHandler({
                methodName: 'getAllReceipts',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_createEntry: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"CreateParkingEntryDto"},
        };
        app.post('/parking-entry/entry',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.createEntry)),

            async function ParkingEntryController_createEntry(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_createEntry, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'createEntry',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_processExit: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"ExitParkingDto"},
        };
        app.post('/parking-entry/exit',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.processExit)),

            async function ParkingEntryController_processExit(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_processExit, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'processExit',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_getActiveEntries: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parking-entry/active',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.getActiveEntries)),

            async function ParkingEntryController_getActiveEntries(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_getActiveEntries, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'getActiveEntries',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_getEntriesByDateRange: Record<string, TsoaRoute.ParameterSchema> = {
                startDate: {"in":"query","name":"startDate","required":true,"dataType":"string"},
                endDate: {"in":"query","name":"endDate","required":true,"dataType":"string"},
        };
        app.get('/parking-entry/report',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.getEntriesByDateRange)),

            async function ParkingEntryController_getEntriesByDateRange(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_getEntriesByDateRange, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'getEntriesByDateRange',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_generateTicket: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"dataType":"nestedObjectLiteral","nestedProperties":{"entryId":{"dataType":"string","required":true}}},
        };
        app.post('/parking-entry/ticket',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.generateTicket)),

            async function ParkingEntryController_generateTicket(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_generateTicket, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'generateTicket',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_getBills: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parking-entry/bills',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.getBills)),

            async function ParkingEntryController_getBills(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_getBills, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'getBills',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingEntryController_generateBill: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/parking-entry/bill/:id',
            authenticateMiddleware([{"bearerAuth":["ATTENDANT","ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingEntryController.prototype.generateBill)),

            async function ParkingEntryController_generateBill(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingEntryController_generateBill, request, response });

                const controller = new ParkingEntryController();

              await templateService.apiHandler({
                methodName: 'generateBill',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingController_createParking: Record<string, TsoaRoute.ParameterSchema> = {
                dto: {"in":"body","name":"dto","required":true,"ref":"CreateParkingDto"},
                req: {"in":"request","name":"req","required":true,"dataType":"object"},
        };
        app.post('/parking/create',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingController.prototype.createParking)),

            async function ParkingController_createParking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingController_createParking, request, response });

                const controller = new ParkingController();

              await templateService.apiHandler({
                methodName: 'createParking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingController_getAllParkings: Record<string, TsoaRoute.ParameterSchema> = {
        };
        app.get('/parking',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingController.prototype.getAllParkings)),

            async function ParkingController_getAllParkings(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingController_getAllParkings, request, response });

                const controller = new ParkingController();

              await templateService.apiHandler({
                methodName: 'getAllParkings',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingController_getParkingById: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.get('/parking/:id',
            authenticateMiddleware([{"bearerAuth":[]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingController.prototype.getParkingById)),

            async function ParkingController_getParkingById(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingController_getParkingById, request, response });

                const controller = new ParkingController();

              await templateService.apiHandler({
                methodName: 'getParkingById',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingController_updateParking: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
                dto: {"in":"body","name":"dto","required":true,"ref":"UpdateParkingDto"},
        };
        app.put('/parking/:id',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingController.prototype.updateParking)),

            async function ParkingController_updateParking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingController_updateParking, request, response });

                const controller = new ParkingController();

              await templateService.apiHandler({
                methodName: 'updateParking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsParkingController_deleteParking: Record<string, TsoaRoute.ParameterSchema> = {
                id: {"in":"path","name":"id","required":true,"dataType":"string"},
        };
        app.delete('/parking/:id',
            authenticateMiddleware([{"bearerAuth":["ADMIN"]}]),
            ...(fetchMiddlewares<RequestHandler>(ParkingController)),
            ...(fetchMiddlewares<RequestHandler>(ParkingController.prototype.deleteParking)),

            async function ParkingController_deleteParking(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsParkingController_deleteParking, request, response });

                const controller = new ParkingController();

              await templateService.apiHandler({
                methodName: 'deleteParking',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        const argsAuthController_login: Record<string, TsoaRoute.ParameterSchema> = {
                requestBody: {"in":"body","name":"requestBody","required":true,"ref":"LoginDto"},
        };
        app.post('/auth/login',
            ...(fetchMiddlewares<RequestHandler>(AuthController)),
            ...(fetchMiddlewares<RequestHandler>(AuthController.prototype.login)),

            async function AuthController_login(request: ExRequest, response: ExResponse, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({ args: argsAuthController_login, request, response });

                const controller = new AuthController();

              await templateService.apiHandler({
                methodName: 'login',
                controller,
                response,
                next,
                validatedArgs,
                successStatus: undefined,
              });
            } catch (err) {
                return next(err);
            }
        });
        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa


    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(Promise.all(secMethodAndPromises)
                        .then(users => { return users[0]; }));
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response)
                                .catch(pushAndRethrow)
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request['user'] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            }
            catch(err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        }
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
