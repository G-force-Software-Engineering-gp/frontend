import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import axios, { Axios } from 'axios';
import { MemoryRouter } from 'react-router-dom';
import HomePageDetails from '../HomePageDetails';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});
// jest.mock('axios');
describe('HomePageDetails Component', () => {
  it('renders without errors', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HomePageDetails />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
  });

  test('displays Starred Workspaces section', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HomePageDetails />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Starred Workspaces')).toBeInTheDocument();
  });

  test('displays Recently viewed section', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HomePageDetails />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Recently viewed')).toBeInTheDocument();
  });

  test('displays Your WorkSpaces section', () => {
    render(
      <MemoryRouter>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HomePageDetails />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>
    );
    expect(screen.getByText('Your WorkSpaces')).toBeInTheDocument();
  });

  // test('renders Buttons for every WorkSpace', async () => {
  //   render(
  //     <MemoryRouter>
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>
  //           <HomePageDetails />
  //         </AuthProvider>
  //       </QueryClientProvider>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     const buttonElement = screen.getByText('Boards');
  //     expect(buttonElement).toBeInTheDocument();
  //   });
  //   await waitFor(() => {
  //     const buttonElement = screen.getByText('Boards');
  //     expect(buttonElement).toHaveClass('mr-1 mt-1 p-2 sm:mt-0');
  //   });
  // });

  // test('displays a "Create a new Board" button', async () => {
  //   render(
  //     <MemoryRouter>
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>
  //           <HomePageDetails />
  //         </AuthProvider>
  //       </QueryClientProvider>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(screen.getByText('Create a new Board')).toBeInTheDocument();
  //   });
  // });

  // test('displays a message when there are no workspaces', async () => {
  //   const mockWorkspaces: [] = [];
  //   jest.mock('axios', () => ({
  //     get: async () => ({ data: mockWorkspaces }),
  //   }));
  //   render(
  //     <MemoryRouter>
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>
  //           <HomePageDetails />
  //         </AuthProvider>
  //       </QueryClientProvider>
  //     </MemoryRouter>
  //   );
  //   await waitFor(() => {
  //     expect(screen.getByText('No workspaces found.')).toBeInTheDocument();
  //   });
  // });

  // test('displays workspace boards', async () => {
  //   // Mock data for workspaces and boards
  //   const mockWorkspaces = [
  //     {
  //       name: 'Workspace1',
  //       boards: [
  //         { id: 1, title: 'Board 1', backgroundImage: 'image1.jpg', has_star: false },
  //         { id: 2, title: 'Board 2', backgroundImage: 'image2.jpg', has_star: true },
  //       ],
  //     },
  //   ];
  //   render(
  //     <MemoryRouter>
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>
  //           <HomePageDetails />
  //         </AuthProvider>
  //       </QueryClientProvider>
  //     </MemoryRouter>
  //   );
  //   // console.log(JSON.parse(localStorage.getItem('authTokens'))?.access);
  //   const authTokens = {
  //     access:
  //       'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjk5MDkxMTEwLCJpYXQiOjE2OTkwMDQ3MTAsImp0aSI6ImJmYjYxZTc4ZjZmODQyOTFhNGZiN2MwNGI5ZGU4ZjEwIiwidXNlcl9pZCI6MX0.DhQeSSxFcrl8p7mIUnSHL1X4as4UeogzJAW1e8Skabk',
  //   };
  //   jest.mock('@/contexts/AuthContext', () => ({
  //     useContext: () => ({ authTokens }),
  //   }));

  //   // Mocking the Axios call to fetch workspaces
  //   jest.mock('axios', () => ({
  //     get: async () => ({ data: mockWorkspaces }),
  //   }));

  //   await waitFor(() => {
  //     expect(screen.getByText('Board 1')).toBeInTheDocument();
  //   });
  //   await waitFor(() => {
  //     expect(screen.getByText('Board 2')).toBeInTheDocument();
  //   });
  // });

  // test('navigates to the correct board when a board is clicked',async () => {
  //   const mockWorkspaces = [
  //     {
  //       name: 'Workspace1',
  //       boards: [{ id: 1, title: 'Board 1', backgroundImage: 'image1.jpg' }],
  //     },
  //   ];
  //   jest.mock('axios', () => ({
  //     get: async () => ({ data: mockWorkspaces }),
  //   }));
  //   const mockNavigate = jest.fn();
  //   jest.mock('react-router-dom', () => ({
  //     useNavigate: () => mockNavigate,
  //   }));

  //   render(
  //     <MemoryRouter>
  //       <AuthProvider>
  //         <HomePageDetails />
  //       </AuthProvider>
  //     </MemoryRouter>
  //   );

  //   await waitFor(() => {
  //     const boardElement = screen.getByText('Board 1');
  //     fireEvent.click(boardElement);
  //     expect(mockNavigate).toHaveBeenCalledWith('/board/1');
  //   });
  //   // Ensure it navigates to the correct board path
  // });
  // test('renders Recently Viewed section with board cards', async () => {
  //   const recentlyBoards = [
  //     { id: 1, title: 'Board 1', backgroundImage: 'url1', has_star: false },
  //     { id: 2, title: 'Board 2', backgroundImage: 'url2', has_star: true },
  //   ];
  //   // Axios.get = jest.fn();
  //   // (Axios.get as jest.Mock<{}>).mockResolvedValue(response);
  //   render(
  //     <MemoryRouter>
  //       <QueryClientProvider client={queryClient}>
  //         <AuthProvider>
  //           <HomePageDetails />
  //         </AuthProvider>
  //       </QueryClientProvider>
  //     </MemoryRouter>
  //   );

  //   // Ensure Recently Viewed heading is rendered
  //   expect(screen.getByText('Recently viewed')).toBeInTheDocument();

  //   // Ensure board cards are rendered
  //   recentlyBoards.forEach((board) => {
  //     expect(screen.getByText(board.title)).toBeInTheDocument();
  //   });
  // });
});
