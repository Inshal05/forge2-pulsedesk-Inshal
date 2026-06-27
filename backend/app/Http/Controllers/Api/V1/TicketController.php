<?php                                                                                                                                               
                                                                                                                                                      
  namespace App\Http\Controllers\Api\V1;                                                                                                              
                                                                                                                                                      
  use App\Http\Controllers\Controller;                                                                                                                
  use App\Http\Requests\Api\V1\StoreTicketRequest;                                                                                                    
  use App\Http\Requests\Api\V1\UpdateTicketRequest;                                                                                                   
  use App\Models\Ticket;                                                                                                                              
  use Illuminate\Http\JsonResponse;                                                                                                                   
  use Illuminate\Http\Request;                                                                                                                        
  use Illuminate\Support\Str;                                                                                                                         
                                                                                                                                                      
  class TicketController extends Controller                                                                                                           
  {                                                                                                                                                   
      public function index(Request $request): JsonResponse                                                                                           
      {                                                                                                                                               
          $tickets = Ticket::where('organization_id', $request->user()->organization_id)                                                              
              ->with(['user', 'assignee'])                                                                                                            
              ->latest()                                                                                                                              
              ->paginate(15);                                                                                                                         
                                                                                                                                                      
          return response()->json($tickets);                                                                                                          
      }                                                                                                                                               
                                                                                                                                                      
      public function store(StoreTicketRequest $request): JsonResponse                                                                                
      {                                                                                                                                               
          $ticket = Ticket::create([                                                                                                                  
              'organization_id' => $request->user()->organization_id,                                                                                 
              'user_id'         => $request->user()->id,                                                                                              
              'ticket_number'   => $this->generateTicketNumber(),                                                                                     
              'title'           => $request->title,                                                                                                   
              'description'     => $request->description,                                                                                             
              'category'        => $request->category,                                                                                                
              'priority'        => $request->priority,                                                                                                
              'status'          => 'Open',                                                                                                            
              'assigned_to'     => $request->assigned_to,                                                                                             
              'due_at'          => $request->due_at,                                                                                                  
          ]);                                                                                                                                         
                                                                                                                                                      
          $ticket->load(['user', 'assignee']);                                                                                                        
                                                                                                                                                      
          return response()->json([                                                                                                                   
              'message' => 'Ticket created successfully.',                                                                                            
              'ticket'  => $ticket,                                                                                                                   
          ], 201);                                                                                                                                    
      }                                                                                                                                               
                                                                                                                                                      
      public function show(Request $request, Ticket $ticket): JsonResponse                                                                            
      {                                                                                                                                               
          $this->authorizeOrganization($request, $ticket);                                                                                            
                                                                                                                                                      
          $ticket->load(['user', 'assignee', 'comments.user']);                                                                                       
                                                                                                                                                      
          return response()->json([                                                                                                                   
              'ticket' => $ticket,                                                                                                                    
          ]);                                                                                                                                         
      }                                                                                                                                               
                                                                                                                                                      
      public function update(UpdateTicketRequest $request, Ticket $ticket): JsonResponse                                                              
      {                                                                                                                                               
          $this->authorizeOrganization($request, $ticket);                                                                                            
                                                                                                                                                      
          $ticket->update($request->validated());                                                                                                     
                                                                                                                                                      
          $ticket->load(['user', 'assignee']);                                                                                                        
                                                                                                                                                      
          return response()->json([                                                                                                                   
              'message' => 'Ticket updated successfully.',                                                                                            
              'ticket'  => $ticket,                                                                                                                   
          ]);                                                                                                                                         
      }                                                                                                                                               
                                                                                                                                                      
      public function destroy(Request $request, Ticket $ticket): JsonResponse                                                                         
      {                                                                                                                                               
          $this->authorizeOrganization($request, $ticket);                                                                                            
                                                                                                                                                      
          $ticket->delete();                                                                                                                          
                                                                                                                                                      
          return response()->json([                                                                                                                   
              'message' => 'Ticket deleted successfully.',                                                                                            
          ]);                                                                                                                                         
      }                                                                                                                                               
                                                                                                                                                      
      private function authorizeOrganization(Request $request, Ticket $ticket): void                                                                  
      {                                                                                                                                               
          if ($ticket->organization_id !== $request->user()->organization_id) {                                                                       
              abort(403, 'This ticket does not belong to your organization.');                                                                        
          }                                                                                                                                           
      }                                                                                                                                               
                                                                                                                                                      
      private function generateTicketNumber(): string                                                                                                 
      {                                                                                                                                               
          return 'TKT-' . strtoupper(Str::random(8));                                                                                                 
      }                                                                                                                                               
  }